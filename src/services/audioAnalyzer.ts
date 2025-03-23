import { AudioAnalysisResult } from '../types/audio';
import { analyzeAudioBuffer } from './lufsCalculator';

/**
 * 使用Web Audio API分析音频文件并计算LUFS值
 * 基于ITU-R BS.1770-4和EBU R128标准
 * @param file 上传的音频或视频文件
 * @returns Promise<AudioAnalysisResult> 分析结果
 */
export const analyzeAudio = async (file: File): Promise<AudioAnalysisResult> => {
  return new Promise((resolve, reject) => {
    try {
      // 创建文件读取器
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        if (!event.target?.result) {
          reject(new Error('文件读取失败'));
          return;
        }
        
        // 获取ArrayBuffer格式的音频数据
        const audioData = event.target.result as ArrayBuffer;
        
        // 创建音频上下文
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        try {
          // 解码音频数据
          const audioBuffer = await audioContext.decodeAudioData(audioData);
          
          // 使用专业LUFS计算器计算LUFS值（基于ITU-R BS.1770-4和EBU R128标准）
          const fileInfo = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          };
          
          const result = analyzeAudioBuffer(audioBuffer, fileInfo);
          
          // 关闭音频上下文
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
      
      // 开始读取文件
      fileReader.readAsArrayBuffer(file);
      
    } catch (error) {
      reject(new Error('分析过程发生错误: ' + error));
    }
  });
};

// 这些函数已移至lufsCalculator.ts，使用专业的ITU-R BS.1770-4和EBU R128标准实现