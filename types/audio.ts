export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface Measurements {
  integratedLoudness: number;
  shortTermLoudness: number;
  truePeak: number;
  loudnessRange: number;
}

export type PlatformStatus = 'compatible' | 'too_loud' | 'too_quiet';

export interface PlatformCompatibility {
  name: string;
  min: number;
  max: number;
  compatible: boolean;
  status: PlatformStatus;
}

export interface PlatformCompatibilities {
  platformCompatibility: PlatformCompatibility[];
}

export interface AudioAnalysisResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  duration: number;
  integratedLUFS: number;
  shortTermLUFSData: number[];
  truePeak: number;
  loudnessRange: number;
  platformCompatibilities: PlatformCompatibilities;
} 