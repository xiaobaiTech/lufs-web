// Web Worker for audio analysis
self.onmessage = function(e) {
  const data = e.data;
  
  try {
    // 执行耗时计算
    const result = processAudioData(data);
    
    // 完成后发送结果回主线程
    self.postMessage({
      status: 'success',
      result: result
    });
  } catch (error) {
    self.postMessage({
      status: 'error',
      error: error.message || '处理音频时发生未知错误'
    });
  }
};

// 处理音频数据的主函数
function processAudioData(data) {
  const { audioChannelData, sampleRate, duration, numberOfChannels } = data;
  
  // 创建一个模拟的AudioBuffer结构
  const audioBufferMock = {
    getChannelData: (channel) => new Float32Array(audioChannelData[channel]),
    sampleRate: sampleRate,
    length: audioChannelData[0].length,
    duration: duration, 
    numberOfChannels: numberOfChannels
  };
  
  // 计算各项LUFS指标
  const integratedLUFS = calculateIntegratedLUFS(audioBufferMock);
  const shortTermLUFSData = calculateShortTermLUFS(audioBufferMock);
  const truePeak = calculateTruePeak(audioBufferMock);
  const loudnessRange = calculateLoudnessRange(audioBufferMock, shortTermLUFSData);
  
  // 返回结果
  return {
    integratedLUFS,
    shortTermLUFSData,
    truePeak,
    loudnessRange
  };
}

// 以下是音频分析的核心函数
// 注意：应将您原有的分析函数迁移到这里，以下是示例实现

// K加权滤波器系数
function createKWeightingFilters(sampleRate) {
  // 第一个滤波器 - 高通滤波器
  const f0 = 38.13547087602444;
  const Q = 0.5003270373238773;
  const K = Math.tan(Math.PI * f0 / sampleRate);
  
  const highpassFilter = {
    b: [1.0, -2.0, 1.0],
    a: [
      1.0 + K / Q + K * K,
      2.0 * (K * K - 1.0),
      1.0 - K / Q + K * K
    ]
  };
  
  // 第二个滤波器 - 高架滤波器
  const f1 = 1681.9744509555319;
  const G = 3.999843853973347;
  const K1 = Math.tan(Math.PI * f1 / sampleRate);
  const V0 = Math.pow(10, G / 20);
  
  const highShelfFilter = {
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
}

// 应用滤波器
function applyFilter(data, filter) {
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
}

// 计算均方值
function calculateMeanSquare(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i];
  }
  return sum / data.length;
}

// 计算积分LUFS值
function calculateIntegratedLUFS(audioBuffer) {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const blockSize = Math.floor(0.3 * sampleRate);
  const numBlocks = Math.floor(audioBuffer.length / blockSize);
  
  const filters = createKWeightingFilters(sampleRate);
  const channelWeights = [1.0, 1.0, 1.0, 1.41, 1.41];
  
  const blockLoudness = [];
  
  for (let block = 0; block < numBlocks; block++) {
    let blockPower = 0;
    
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      
      // 为本块创建新数组
      const blockData = new Float32Array(blockSize);
      const start = block * blockSize;
      const end = Math.min((block + 1) * blockSize, channelData.length);
      
      for (let i = 0; i < (end - start); i++) {
        blockData[i] = channelData[start + i];
      }
      
      // 应用K加权滤波
      let filteredData = blockData;
      for (const filter of filters) {
        filteredData = applyFilter(filteredData, filter);
      }
      
      // 计算均方值并应用通道权重
      const weight = channel < channelWeights.length ? channelWeights[channel] : 1.0;
      blockPower += calculateMeanSquare(filteredData) * weight;
    }
    
    // 计算块响度
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
  const relativeGateThreshold = 10 * Math.log10(avgLoudness) - 8;
  
  // 应用相对门限
  filteredBlocks = blockLoudness.filter(loudness => loudness > relativeGateThreshold);
  
  if (filteredBlocks.length === 0) {
    return ungatedLUFS;
  }
  
  // 计算最终的积分LUFS
  const integratedLoudness = filteredBlocks.reduce((sum, value) => sum + Math.pow(10, value / 10), 0) / filteredBlocks.length;
  const integratedLUFS = 10 * Math.log10(integratedLoudness);
  
  return integratedLUFS - 0.1;
}

// 计算短期LUFS值
function calculateShortTermLUFS(audioBuffer) {
  // 简化版本，实际实现应该更复杂
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const windowSize = 3 * sampleRate;
  const hopSize = Math.floor(sampleRate / 10);
  const numWindows = Math.max(1, Math.floor((audioBuffer.length - windowSize) / hopSize) + 1);
  
  const filters = createKWeightingFilters(sampleRate);
  const channelWeights = [1.0, 1.0, 1.0, 1.41, 1.41];
  
  const shortTermLUFS = [];
  
  // 处理较短的音频
  if (audioBuffer.length < windowSize) {
    // 对于很短的音频，使用整个音频计算一个LUFS值
    return [calculateIntegratedLUFS(audioBuffer)];
  }
  
  // 标准短期LUFS计算
  for (let window = 0; window < numWindows; window++) {
    let windowPower = 0;
    
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const windowStart = window * hopSize;
      const windowEnd = Math.min(windowStart + windowSize, audioBuffer.length);
      
      // 为本窗口创建新数组
      const windowData = new Float32Array(windowEnd - windowStart);
      for (let i = 0; i < (windowEnd - windowStart); i++) {
        windowData[i] = channelData[windowStart + i];
      }
      
      // 应用K加权滤波
      let filteredData = windowData;
      for (const filter of filters) {
        filteredData = applyFilter(filteredData, filter);
      }
      
      // 计算均方值并应用通道权重
      const weight = channel < channelWeights.length ? channelWeights[channel] : 1.0;
      windowPower += calculateMeanSquare(filteredData) * weight;
    }
    
    // 计算短期LUFS
    const loudness = -0.691 + 10 * Math.log10(windowPower);
    shortTermLUFS.push(loudness);
  }
  
  return shortTermLUFS;
}

// 计算真峰值
function calculateTruePeak(audioBuffer) {
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
  
  // 转换为dBTP
  return 20 * Math.log10(maxPeak);
}

// 计算响度范围
function calculateLoudnessRange(audioBuffer, shortTermLUFS) {
  if (!shortTermLUFS || shortTermLUFS.length < 2) {
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
} 