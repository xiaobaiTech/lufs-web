/**
 * 安全地创建Web Worker的辅助函数
 * 
 * 这个函数针对Next.js环境设计，解决了静态分析的问题
 */
export function createWorker(scriptPath: string): Worker | null {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || !window.Worker) {
    return null;
  }

  try {
    // 使用URL构造函数创建Worker，使其在Next.js中正常工作
    return new Worker(new URL(scriptPath, window.location.origin));
  } catch (error) {
    console.error('创建Web Worker失败:', error);
    return null;
  }
} 