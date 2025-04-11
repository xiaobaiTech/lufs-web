// 基础worker脚本
self.onmessage = function(e) {
  const data = e.data;
  
  // 如果是初始化消息，加载真正的worker
  if (data.type === 'init') {
    // 通知主线程我们收到了初始化消息
    self.postMessage({ status: 'initializing' });
    
    // 这里我们加载真正的worker代码
    try {
      importScripts(data.url);
      self.postMessage({ status: 'ready' });
    } catch (error) {
      self.postMessage({ 
        error: '加载Worker脚本失败: ' + (error.message || '未知错误') 
      });
    }
  }
  // 如果是分析消息，转发给真正的处理函数
  else if (data.type === 'analyze') {
    try {
      // 检查是否已成功加载处理函数
      if (typeof self.processAudio === 'function') {
        self.processAudio(data);
      } else {
        // 如果没有加载处理函数，使用内置的简单分析
        self.postMessage({
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileType: data.fileType,
          integratedLUFS: -16, // 简单默认值
          shortTermLUFSData: [-16],
          truePeak: 0,
          loudnessRange: 0,
          error: '无法加载完整分析功能，返回模拟数据'
        });
      }
    } catch (error) {
      self.postMessage({ 
        error: '音频分析失败: ' + (error.message || '未知错误') 
      });
    }
  }
}; 