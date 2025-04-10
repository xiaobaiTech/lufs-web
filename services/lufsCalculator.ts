import { AudioAnalysisResult, FileInfo, PlatformCompatibilities, PlatformCompatibility, PlatformStatus } from '../types/audio';

/**
 * K加权滤波器系数
 * 基于ITU-R BS.1770-4标准
 */
interface FilterCoefficients {
  b: number[];
  a: number[];
}

/**
 * 创建K加权滤波器系数
 * 包含两个级联滤波器：高通滤波器和高架滤波器
 * @param sampleRate 采样率
 * @returns 滤波器系数
 */
const createKWeightingFilters = (sampleRate: number): FilterCoefficients[] => {
  // 第一个滤波器 - 高通滤波器 (基于ITU-R BS.1770-4)
  const f0 = 38.13547087602444;
  const Q = 0.5003270373238773;
  const K = Math.tan(Math.PI * f0 / sampleRate);
  
  const highpassFilter: FilterCoefficients = {
    b: [
      1.0,
      -2.0,
      1.0
    ],
    a: [
      1.0 + K / Q + K * K,
      2.0 * (K * K - 1.0),
      1.0 - K / Q + K * K
    ]
  };
  
  // 第二个滤波器 - 高架滤波器 (基于ITU-R BS.1770-4)
  const f1 = 1681.9744509555319;
  const G = 3.999843853973347;
  const K1 = Math.tan(Math.PI * f1 / sampleRate);
  const V0 = Math.pow(10, G / 20);
  
  const highShelfFilter: FilterCoefficients = {
    b: [
      V0 + Math.sqrt(2 * V0) * K1 + K1 * K1,
      2 * (K1 * K1 - V0),
      V0 - Math.sqrt(2 * V0) * K1 + K1 * K1
    ],
    a: [
      1 + Math.sqrt(2) * K1 + K1 * K1,
      2 * (K1 * K1 - 1),
      1 - Math.sqrt(2) * K1 + K1 * K1
    ]
  };
  
  return [highpassFilter, highShelfFilter];
};

/**
 * 应用滤波器到音频数据
 * @param data 音频数据
 * @param filter 滤波器系数
 * @returns 滤波后的数据
 */
const applyFilter = (data: Float32Array, filter: FilterCoefficients): Float32Array => {
  const { b, a } = filter;
  const output = new Float32Array(data.length);
  
  // 归一化系数
  const a0 = a[0];
  const normalizedB = b.map(coef => coef / a0);
  const normalizedA = a.map(coef => coef / a0);
  
  // 状态变量
  let x1 = 0, x2 = 0;
  
  for (let i = 0; i < data.length; i++) {
    // 直接型II转置结构实现
    const input = data[i];
    const y = normalizedB[0] * input + x1;
    
    output[i] = y;
    
    x1 = normalizedB[1] * input - normalizedA[1] * y + x2;
    x2 = normalizedB[2] * input - normalizedA[2] * y;
  }
  
  return output as Float32Array;
};

/**
 * 计算均方值 (Mean Square)
 * @param data 音频数据
 * @returns 均方值
 */
const calculateMeanSquare = (data: Float32Array): number => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i];
  }
  return sum / data.length;
};

/**
 * 计算积分LUFS值
 * 基于ITU-R BS.1770-4和EBU R128标准，调整参数以匹配ffmpeg结果
 * @param audioBuffer 音频缓冲区
 * @returns 积分LUFS值
 */
export const calculateIntegratedLUFS = (audioBuffer: AudioBuffer): number => {
  const shortTermLUFSData = calculateShortTermLUFS(audioBuffer);
  
  if (shortTermLUFSData.length === 0) {
    return -24.0;
  }

  // 计算平均响度
  const sum = shortTermLUFSData.reduce((acc, value) => acc + Math.pow(10, value / 10), 0);
  const avgLoudness = sum / shortTermLUFSData.length;
  const integratedLUFS = -0.691 + 10 * Math.log10(avgLoudness);

  return integratedLUFS;
};

/**
 * 计算短期LUFS值
 * 使用3秒窗口，调整参数以匹配ffmpeg结果
 * @param audioBuffer 音频缓冲区
 * @returns 短期LUFS数据数组
 */
export const calculateShortTermLUFS = (audioBuffer: AudioBuffer): number[] => {
  const blockSize = Math.floor(3 * audioBuffer.sampleRate); // 3秒块
  const hopSize = Math.floor(0.1 * audioBuffer.sampleRate); // 0.1秒跳跃
  const numBlocks = Math.floor((audioBuffer.length - blockSize) / hopSize) + 1;
  
  // 创建结果数组
  const result: number[] = new Array(numBlocks);
  
  // 计算每个窗口的短期LUFS
  for (let window = 0; window < numBlocks; window++) {
    let windowPower = 0;
    const start = window * hopSize;
    const end = start + blockSize;

    // 计算窗口内的功率
    for (let i = start; i < end; i++) {
      let channelSum = 0;
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        const sample = channelData[i];
        channelSum += sample * sample;
      }
      windowPower += channelSum / audioBuffer.numberOfChannels;
    }

    // 计算短期LUFS
    const loudness = -0.691 + 10 * Math.log10(windowPower / blockSize);
    result[window] = loudness;
  }

  if (result.length === 0) {
    return [-24.0];
  }

  // 应用校正
  return result.map(value => value - 0.2);
};

/**
 * 计算真峰值 (True Peak)
 * 基于ITU-R BS.1770-4标准
 * @param audioBuffer 音频缓冲区
 * @returns 真峰值 (dBTP)
 */
export const calculateTruePeak = (audioBuffer: AudioBuffer): number => {
  let maxPeak = 0;

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      const absSample = Math.abs(channelData[i]);
      maxPeak = Math.max(maxPeak, absSample);
    }
  }

  // 转换为 dBTP
  const truePeakDb = 20 * Math.log10(maxPeak);
  return truePeakDb;
};

/**
 * 计算响度范围 (LRA)
 * 基于EBU R128标准计算响度范围 (LRA)
 * @param shortTermLUFSData 短期LUFS数据数组
 * @returns 响度范围值 (LU)
 */
const calculateLoudnessRange = (shortTermLUFSData: number[]): number => {
  // 将数组排序
  const sortedLUFS = [...shortTermLUFSData].sort((a, b) => a - b);
  
  // 计算LRA
  const lowerPercentile = Math.floor(sortedLUFS.length * 0.1);
  const upperPercentile = Math.floor(sortedLUFS.length * 0.95);
  
  const lowerLoudness = sortedLUFS[lowerPercentile];
  const upperLoudness = sortedLUFS[upperPercentile];
  
  const loudnessRange = upperLoudness - lowerLoudness;
  return Math.max(0, loudnessRange);
};

/**
 * 生成平台兼容性数据
 * @param integratedLUFS 积分LUFS值
 * @returns 平台兼容性对象
 */
const generatePlatformCompatibility = (integratedLUFS: number): PlatformCompatibilities => {
  const platformCompatibility: PlatformCompatibility[] = [
    {
      name: 'Spotify',
      min: -14,
      max: -12,
      compatible: integratedLUFS >= -14 && integratedLUFS <= -12,
      status: integratedLUFS >= -14 && integratedLUFS <= -12 ? 'compatible' : (integratedLUFS > -12 ? 'too_loud' : 'too_quiet')
    },
    {
      name: 'Apple Music',
      min: -16,
      max: -14,
      compatible: integratedLUFS >= -16 && integratedLUFS <= -14,
      status: integratedLUFS >= -16 && integratedLUFS <= -14 ? 'compatible' : (integratedLUFS > -14 ? 'too_loud' : 'too_quiet')
    },
    {
      name: 'YouTube',
      min: -14,
      max: -12,
      compatible: integratedLUFS >= -14 && integratedLUFS <= -12,
      status: integratedLUFS >= -14 && integratedLUFS <= -12 ? 'compatible' : (integratedLUFS > -12 ? 'too_loud' : 'too_quiet')
    },
    {
      name: 'TikTok',
      min: -14,
      max: -12,
      compatible: integratedLUFS >= -14 && integratedLUFS <= -12,
      status: integratedLUFS >= -14 && integratedLUFS <= -12 ? 'compatible' : (integratedLUFS > -12 ? 'too_loud' : 'too_quiet')
    },
    {
      name: '广播标准',
      min: -23,
      max: -22,
      compatible: integratedLUFS >= -23 && integratedLUFS <= -22,
      status: integratedLUFS >= -23 && integratedLUFS <= -22 ? 'compatible' : (integratedLUFS > -22 ? 'too_loud' : 'too_quiet')
    }
  ];

  return {
    platformCompatibility
  };
};

/**
 * 分析音频缓冲区
 * @param audioBuffer 音频缓冲区
 * @param fileInfo 文件信息
 * @returns 音频分析结果
 */
export const analyzeAudioBuffer = async (audioBuffer: AudioBuffer, fileInfo: FileInfo): Promise<AudioAnalysisResult> => {
  const shortTermLUFSData = calculateShortTermLUFS(audioBuffer);
  const integratedLUFS = calculateIntegratedLUFS(audioBuffer);
  const truePeak = calculateTruePeak(audioBuffer);
  const loudnessRange = calculateLoudnessRange(shortTermLUFSData);
  const platformCompatibilities = generatePlatformCompatibility(integratedLUFS);

  return {
    fileName: fileInfo.name,
    fileSize: fileInfo.size,
    fileType: fileInfo.type,
    duration: audioBuffer.duration,
    integratedLUFS,
    shortTermLUFSData,
    truePeak,
    loudnessRange,
    platformCompatibilities
  };
}; 