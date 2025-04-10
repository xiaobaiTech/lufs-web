import { AudioAnalysisResult, PlatformCompatibilities, PlatformStatus } from '@/types/audio';

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
 * 应用滤波器
 */
const applyFilter = (data: Float32Array, filter: FilterCoefficients): Float32Array => {
  const result = new Float32Array(data.length);
  const b = filter.b;
  const a = filter.a;
  
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < b.length; j++) {
      if (i - j >= 0) {
        sum += b[j] * data[i - j];
      }
    }
    for (let j = 1; j < a.length; j++) {
      if (i - j >= 0) {
        sum -= a[j] * result[i - j];
      }
    }
    result[i] = sum / a[0];
  }
  
  return result;
};

/**
 * 计算均方值
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
 */
const calculateIntegratedLUFS = (audioBuffer: AudioBuffer): number => {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const blockSize = Math.floor(0.3 * sampleRate); // 使用300ms块大小
  const numBlocks = Math.floor(audioBuffer.length / blockSize);
  
  const filters = createKWeightingFilters(sampleRate);
  const channelWeights = [1.0, 1.0, 1.0, 1.41, 1.41];
  
  const blockLoudness: number[] = [];
  
  for (let block = 0; block < numBlocks; block++) {
    let blockPower = 0;
    
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const blockData = channelData.slice(block * blockSize, (block + 1) * blockSize);
      
      const buffer = new ArrayBuffer(blockData.length * 4);
      const array = new Float32Array(buffer);
      array.set(blockData);
      
      let filteredData = array;
      for (const filter of filters) {
        filteredData = applyFilter(filteredData, filter);
      }
      
      const weight = channel < channelWeights.length ? channelWeights[channel] : 1.0;
      blockPower += calculateMeanSquare(filteredData) * weight;
    }
    
    const loudness = -0.691 + 10 * Math.log10(blockPower);
    blockLoudness.push(loudness);
  }
  
  // 计算未门限的LUFS
  const ungatedLoudness = blockLoudness.reduce((sum, value) => sum + Math.pow(10, value / 10), 0) / blockLoudness.length;
  const ungatedLUFS = 10 * Math.log10(ungatedLoudness);
  
  // 应用绝对门限
  const absoluteGateThreshold = -70;
  let filteredBlocks = blockLoudness.filter(loudness => loudness > absoluteGateThreshold);
  
  if (filteredBlocks.length === 0) {
    return ungatedLUFS;
  }
  
  // 计算相对门限
  const avgLoudness = filteredBlocks.reduce((sum, value) => sum + Math.pow(10, value / 10), 0) / filteredBlocks.length;
  const relativeGateThreshold = 10 * Math.log10(avgLoudness) - 8; // 使用-8 LU
  
  // 应用相对门限
  filteredBlocks = blockLoudness.filter(loudness => loudness > relativeGateThreshold);
  
  if (filteredBlocks.length === 0) {
    return ungatedLUFS;
  }
  
  // 计算最终的积分LUFS
  const integratedLoudness = filteredBlocks.reduce((sum, value) => sum + Math.pow(10, value / 10), 0) / filteredBlocks.length;
  const integratedLUFS = 10 * Math.log10(integratedLoudness);
  
  return integratedLUFS - 0.1; // 应用-0.1的偏移量
};

/**
 * 计算短期LUFS值
 */
const calculateShortTermLUFS = (audioBuffer: AudioBuffer): number[] => {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const windowSize = 3 * sampleRate;
  const hopSize = Math.floor(sampleRate / 10);
  const numWindows = Math.floor((audioBuffer.length - windowSize) / hopSize) + 1;
  
  const filters = createKWeightingFilters(sampleRate);
  const channelWeights = [1.0, 1.0, 1.0, 1.41, 1.41];
  
  const shortTermLUFS: number[] = [];
  
  for (let window = 0; window < numWindows; window++) {
    let windowPower = 0;
    
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const windowStart = window * hopSize;
      const windowEnd = Math.min(windowStart + windowSize, audioBuffer.length);
      const windowData = channelData.slice(windowStart, windowEnd);
      
      let filteredData = windowData;
      for (const filter of filters) {
        filteredData = applyFilter(filteredData, filter);
      }
      
      const weight = channel < channelWeights.length ? channelWeights[channel] : 1.0;
      windowPower += calculateMeanSquare(filteredData) * weight;
    }
    
    const loudness = -0.691 + 10 * Math.log10(windowPower);
    shortTermLUFS.push(loudness);
  }
  
  return shortTermLUFS.length === 0 ? [-24.0] : shortTermLUFS;
};

/**
 * 计算真实峰值
 */
const calculateTruePeak = (audioBuffer: AudioBuffer): number => {
  let maxPeak = 0;
  
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      const absValue = Math.abs(channelData[i]);
      if (absValue > maxPeak) {
        maxPeak = absValue;
      }
    }
  }
  
  return 20 * Math.log10(maxPeak);
};

/**
 * 计算响度范围
 */
const calculateLoudnessRange = (audioBuffer: AudioBuffer): number => {
  const shortTermLUFS = calculateShortTermLUFS(audioBuffer);
  
  if (shortTermLUFS.length < 2) {
    return 0;
  }
  
  // 排序LUFS值
  const sortedLUFS = [...shortTermLUFS].sort((a, b) => a - b);
  
  // 计算百分位数
  const lowPercentile = Math.floor(sortedLUFS.length * 0.1);
  const highPercentile = Math.floor(sortedLUFS.length * 0.95);
  
  // 计算响度范围
  const lowValue = sortedLUFS[lowPercentile];
  const highValue = sortedLUFS[highPercentile];
  
  return Math.max(0, highValue - lowValue);
};

/**
 * 生成平台兼容性数据
 */
const generatePlatformCompatibility = (integratedLoudness: number): PlatformCompatibilities => {
  return {
    spotify: {
      name: 'Spotify',
      target: -14,
      compatible: integratedLoudness >= -15 && integratedLoudness <= -13,
      status: (integratedLoudness > -13 ? 'too_loud' : integratedLoudness < -15 ? 'too_quiet' : 'compatible') as PlatformStatus
    },
    youtube: {
      name: 'YouTube',
      target: -14,
      compatible: integratedLoudness >= -15 && integratedLoudness <= -13,
      status: (integratedLoudness > -13 ? 'too_loud' : integratedLoudness < -15 ? 'too_quiet' : 'compatible') as PlatformStatus
    },
    appleMusic: {
      name: 'Apple Music',
      target: -16,
      compatible: integratedLoudness >= -17 && integratedLoudness <= -15,
      status: (integratedLoudness > -15 ? 'too_loud' : integratedLoudness < -17 ? 'too_quiet' : 'compatible') as PlatformStatus
    },
    tiktok: {
      name: '抖音/TikTok',
      target: -14,
      compatible: integratedLoudness >= -15 && integratedLoudness <= -13,
      status: (integratedLoudness > -13 ? 'too_loud' : integratedLoudness < -15 ? 'too_quiet' : 'compatible') as PlatformStatus
    },
    broadcast: {
      name: '广播标准',
      target: -23,
      compatible: integratedLoudness >= -24 && integratedLoudness <= -22,
      status: (integratedLoudness > -22 ? 'too_loud' : integratedLoudness < -24 ? 'too_quiet' : 'compatible') as PlatformStatus
    }
  };
};

/**
 * 分析音频文件
 */
export const analyzeAudio = async (file: File): Promise<AudioAnalysisResult> => {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        if (!event.target?.result) {
          reject(new Error('文件读取失败'));
          return;
        }
        
        const audioData = event.target.result as ArrayBuffer;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        try {
          const audioBuffer = await audioContext.decodeAudioData(audioData);
          
          const integratedLoudness = calculateIntegratedLUFS(audioBuffer);
          const shortTermLUFSData = calculateShortTermLUFS(audioBuffer);
          const truePeak = calculateTruePeak(audioBuffer);
          const loudnessRange = calculateLoudnessRange(audioBuffer);
          
          // 计算短期LUFS的平均值
          const shortTermLoudness = shortTermLUFSData.length > 0 
            ? shortTermLUFSData.reduce((sum, value) => sum + value, 0) / shortTermLUFSData.length
            : -70;
          
          const result: AudioAnalysisResult = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            duration: audioBuffer.duration,
            integratedLUFS: integratedLoudness,
            shortTermLUFSData,
            truePeak,
            loudnessRange,
            platformCompatibilities: generatePlatformCompatibility(integratedLoudness)
          };
          
          audioContext.close();
          resolve(result);
          
        } catch (error) {
          audioContext.close();
          reject(new Error('音频解码失败: ' + error));
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('文件读取错误'));
      };
      
      fileReader.readAsArrayBuffer(file);
      
    } catch (error) {
      reject(new Error('分析过程发生错误: ' + error));
    }
  });
}; 