/**
 * 音频分析结果接口
 */
export interface AudioAnalysisResult {
  // 集成响度 (Integrated LUFS)
  integratedLoudness: number;
  
  // 短期响度 (Short-term LUFS)
  shortTermLoudness: number;
  
  // 真实峰值 (True Peak)
  truePeak: number;
  
  // 响度范围 (LRA)
  loudnessRange: number;
  
  // 音频时长（秒）
  duration: number;
  
  // 短期LUFS数据（用于图表显示）
  shortTermLUFSData: number[];
  
  // 文件信息
  fileName: string;
  fileSize: number;
  fileType: string;
  
  // 平台兼容性
  platformCompatibility: {
    youtube: PlatformCompatibility;
    spotify: PlatformCompatibility;
    netflix: PlatformCompatibility;
    appleMusic: PlatformCompatibility;
    amazonMusic: PlatformCompatibility;
    broadcast: PlatformCompatibility;
    tiktok: PlatformCompatibility;
  };
}

/**
 * 平台兼容性接口
 */
export interface PlatformCompatibility {
  name: string;
  target: number;
  compatible: boolean;
  status: 'compatible' | 'too_loud' | 'too_quiet';
}

/**
 * 分析状态
 */
export enum AnalysisStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}