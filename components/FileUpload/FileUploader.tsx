"use client";

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
}

const FileUploader = ({ onFileSelected }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const validAudioFormats = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mpeg', 'audio/m4a', 'audio/x-m4a'];
    const validVideoFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    const validFormats = [...validAudioFormats, ...validVideoFormats];
    
    if (validFormats.includes(file.type)) {
      setIsUploading(true);
      // 调用父组件的回调函数处理文件
      onFileSelected(file);
    } else {
      alert('请上传有效的音频或视频文件');
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex-1">
      <div
        className={`
          min-h-[400px] 
          border-2 border-dashed rounded-2xl
          flex flex-col items-center justify-center
          transition-all duration-300 ${isUploading ? 'cursor-wait' : 'cursor-pointer'}
          ${isDragging ? 'border-[#6366F1] bg-[#E0E7FF]' : 'border-[#818CF8] bg-[#EEF2FF] hover:bg-[#E0E7FF]'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-20 px-6">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600 mb-10"></div>
              <h3 className="text-3xl font-semibold text-[#4338CA] mb-4">正在处理文件...</h3>
              <p className="text-gray-600 text-xl mb-10">请稍候，我们正在分析您的音频</p>
            </>
          ) : (
            <>
              {/* 云图标 */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-32 h-32 text-[#6366F1] mb-10" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              
              <h3 className="text-3xl font-semibold text-[#4338CA] mb-4">拖放文件到这里</h3>
              <p className="text-gray-600 text-xl mb-10">或者点击选择文件</p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="audio/*,video/*"
                onChange={handleFileInputChange}
              />
              
              <button 
                onClick={handleButtonClick} 
                className="upload-btn bg-[#6366F1] text-white px-8 py-3 rounded-xl text-base font-medium hover:bg-[#4F46E5] transition-all duration-300"
                disabled={isUploading}
              >
                选择文件
              </button>
            </>
          )}
        </div>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '24px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <p style={{ 
          color: '#4338CA', 
          fontWeight: '600', 
          fontSize: '16px', 
          marginBottom: '20px' 
        }}>
          支持的文件格式:
        </p>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px' // 增加间距
        }}>
          {['MP3', 'WAV', 'FLAC', 'AAC', 'M4A', 'MP4', 'MOV', 'AVI'].map((format) => (
            <span 
              key={format}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#EEF2FF', 
                color: '#4338CA', 
                borderRadius: '9999px', 
                fontSize: '14px', 
                fontWeight: '500',
                display: 'inline-block',
                transition: 'all 0.2s ease-in-out',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#E0E7FF';
                e.currentTarget.style.color = '#4F46E5';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#EEF2FF';
                e.currentTarget.style.color = '#4338CA';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;