'use client';

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useRouter } from 'next/navigation';
import Header from '@/components/Layout/Header';
import { AudioAnalysisResult, PlatformCompatibilities, PlatformStatus } from '../types/audio';

// 默认值，在数据无效时使用
const DEFAULT_ANALYSIS: AudioAnalysisResult = {
  fileName: '未知文件',
  fileSize: 0,
  fileType: '未知类型',
  duration: 0,
  integratedLUFS: -14,
  shortTermLUFSData: [-14, -14],
  truePeak: 0,
  loudnessRange: 0,
  platformCompatibilities: {
    spotify: {
      name: 'Spotify',
      target: -14,
      compatible: false,
      status: 'compatible'
    },
    youtube: {
      name: 'YouTube',
      target: -14,
      compatible: false,
      status: 'compatible'
    },
    appleMusic: {
      name: 'Apple Music',
      target: -16,
      compatible: false,
      status: 'compatible'
    },
    tiktok: {
      name: '抖音/TikTok',
      target: -14,
      compatible: false,
      status: 'compatible'
    },
    broadcast: {
      name: '广播标准',
      target: -23,
      compatible: false,
      status: 'compatible'
    }
  }
};

export default function ResultsPage() {
  const chartRef = useRef<Chart | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 从 localStorage 获取分析结果
    try {
      const storedResult = localStorage.getItem('audioAnalysisResult');
      
      if (!storedResult) {
        console.log('未找到存储的分析结果');
        setError('未找到分析结果，请返回首页上传文件');
        setIsLoading(false);
        return;
      }
      
      // 尝试解析JSON
      let parsedResult: unknown;
      try {
        parsedResult = JSON.parse(storedResult);
      } catch (e) {
        console.error('JSON解析失败:', e);
        setError('数据格式错误，无法解析分析结果');
        setIsLoading(false);
        return;
      }
      
      // 验证基本结构
      if (!parsedResult || typeof parsedResult !== 'object') {
        setError('无效的分析结果格式');
        setIsLoading(false);
        return;
      }
      
      // 类型断言
      const typedResult = parsedResult as Record<string, unknown>;
      
      // 修复或填充缺失的数据
      const validatedResult: AudioAnalysisResult = {
        fileName: typeof typedResult.fileName === 'string' ? typedResult.fileName : DEFAULT_ANALYSIS.fileName,
        fileSize: typeof typedResult.fileSize === 'number' ? typedResult.fileSize : DEFAULT_ANALYSIS.fileSize,
        fileType: typeof typedResult.fileType === 'string' ? typedResult.fileType : DEFAULT_ANALYSIS.fileType,
        duration: typeof typedResult.duration === 'number' ? typedResult.duration : DEFAULT_ANALYSIS.duration,
        integratedLUFS: typeof typedResult.integratedLUFS === 'number' ? typedResult.integratedLUFS : DEFAULT_ANALYSIS.integratedLUFS,
        shortTermLUFSData: Array.isArray(typedResult.shortTermLUFSData) ? 
          typedResult.shortTermLUFSData.filter((item): item is number => typeof item === 'number') : 
          DEFAULT_ANALYSIS.shortTermLUFSData,
        truePeak: typeof typedResult.truePeak === 'number' ? typedResult.truePeak : DEFAULT_ANALYSIS.truePeak,
        loudnessRange: typeof typedResult.loudnessRange === 'number' ? typedResult.loudnessRange : DEFAULT_ANALYSIS.loudnessRange,
        platformCompatibilities: validatePlatformCompatibilities(typedResult.platformCompatibilities)
      };
      
      // 确保shortTermLUFSData至少有一个值
      if (validatedResult.shortTermLUFSData.length === 0) {
        validatedResult.shortTermLUFSData = [validatedResult.integratedLUFS];
      }
      
      setAnalysisResult(validatedResult);
      setIsLoading(false);
    } catch (error) {
      console.error('加载分析结果时出错:', error);
      setError('加载分析结果时发生错误');
      setIsLoading(false);
    }
  }, []);

  // 验证平台兼容性数据
  function validatePlatformCompatibilities(data: unknown): PlatformCompatibilities {
    if (!data || typeof data !== 'object') {
      return DEFAULT_ANALYSIS.platformCompatibilities;
    }
    
    const result: PlatformCompatibilities = { ...DEFAULT_ANALYSIS.platformCompatibilities };
    const platforms = ['spotify', 'youtube', 'appleMusic', 'tiktok', 'broadcast'];
    
    const typedData = data as Record<string, unknown>;
    
    for (const platform of platforms) {
      const platformData = typedData[platform];
      if (platformData && typeof platformData === 'object') {
        const typedPlatformData = platformData as Record<string, unknown>;
        result[platform] = {
          name: typeof typedPlatformData.name === 'string' ? typedPlatformData.name : DEFAULT_ANALYSIS.platformCompatibilities[platform].name,
          target: typeof typedPlatformData.target === 'number' ? typedPlatformData.target : DEFAULT_ANALYSIS.platformCompatibilities[platform].target,
          compatible: typeof typedPlatformData.compatible === 'boolean' ? typedPlatformData.compatible : DEFAULT_ANALYSIS.platformCompatibilities[platform].compatible,
          status: typeof typedPlatformData.status === 'string' && ['compatible', 'too_loud', 'too_quiet'].includes(typedPlatformData.status as string) ? 
            typedPlatformData.status as PlatformStatus : DEFAULT_ANALYSIS.platformCompatibilities[platform].status
        };
      }
    }
    
    return result;
  }

  useEffect(() => {
    if (analysisResult && analysisResult.shortTermLUFSData) {
      try {
        const ctx = document.getElementById('loudnessChart') as HTMLCanvasElement;
        if (ctx) {
          // 销毁之前的图表实例
          if (chartRef.current) {
            chartRef.current.destroy();
          }

          // 创建新的图表实例
          chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: Array.from({length: analysisResult.shortTermLUFSData.length}, (_, i) => 
                Math.ceil(i * (analysisResult.duration / analysisResult.shortTermLUFSData.length))
              ),
              datasets: [
                {
                  label: '短期响度',
                  data: analysisResult.shortTermLUFSData,
                  borderColor: 'rgba(99, 102, 241, 1)',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  tension: 0.4,
                  fill: true
                },
                {
                  label: '集成响度',
                  data: Array(analysisResult.shortTermLUFSData.length).fill(analysisResult.integratedLUFS),
                  borderColor: 'rgba(220, 38, 38, 1)',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  pointRadius: 0
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'LUFS'
                  },
                  min: Math.floor(Math.min(...analysisResult.shortTermLUFSData, analysisResult.integratedLUFS) - 2),
                  max: Math.ceil(Math.max(...analysisResult.shortTermLUFSData, analysisResult.integratedLUFS) + 2)
                },
                x: {
                  title: {
                    display: true,
                    text: '时间 (秒)'
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('创建图表时出错:', error);
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [analysisResult]);

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else if (page === 'results') {
      router.push('/results');
    }
  };
  
  const clearResults = () => {
    localStorage.removeItem('audioAnalysisResult');
    router.push('/');
  };

  if (isLoading) {
    return (
      <>
        <Header activePage="results" onNavigate={handleNavigate} />
        <div className="container mx-auto p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        </div>
      </>
    );
  }

  if (error || !analysisResult) {
    return (
      <>
        <Header activePage="results" onNavigate={handleNavigate} />
        <div className="container mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-6">错误</h1>
            <p className="mb-4 text-red-600">{error || '未找到有效的分析结果'}</p>
            <p className="mb-6">请返回首页上传文件进行分析。</p>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                返回首页
              </button>
              <button
                onClick={clearResults}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
              >
                清除缓存数据
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header activePage="results" onNavigate={handleNavigate} />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">分析结果</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">文件信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">文件名</p>
                <p className="mt-1 font-medium text-gray-900 break-all">{analysisResult.fileName}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">文件大小</p>
                <p className="mt-1 font-medium text-gray-900">
                  {analysisResult.fileSize >= 1024 * 1024
                    ? `${(analysisResult.fileSize / (1024 * 1024)).toFixed(2)} MB`
                    : `${(analysisResult.fileSize / 1024).toFixed(2)} KB`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">时长</p>
                <p className="mt-1 font-medium text-gray-900">
                  {Math.floor(analysisResult.duration / 60)}分{Math.floor(analysisResult.duration % 60)}秒
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">LUFS 测量结果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <p className="text-sm font-medium text-indigo-600 mb-1">集成响度</p>
              <p className="text-3xl font-bold text-indigo-700">{analysisResult.integratedLUFS.toFixed(1)}<span className="text-lg font-medium ml-1">LUFS</span></p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-sm font-medium text-blue-600 mb-1">短期响度</p>
              <p className="text-3xl font-bold text-blue-700">{analysisResult.shortTermLUFSData[0].toFixed(1)}<span className="text-lg font-medium ml-1">LUFS</span></p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <p className="text-sm font-medium text-red-600 mb-1">真峰值</p>
              <p className="text-3xl font-bold text-red-700">{analysisResult.truePeak.toFixed(1)}<span className="text-lg font-medium ml-1">dBTP</span></p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <p className="text-sm font-medium text-emerald-600 mb-1">响度范围</p>
              <p className="text-3xl font-bold text-emerald-700">{analysisResult.loudnessRange.toFixed(1)}<span className="text-lg font-medium ml-1">LU</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">平台兼容性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(analysisResult.platformCompatibilities).map(([key, platform]) => (
              <div
                key={key}
                className={`p-6 rounded-lg border-l-4 ${
                  platform.compatible
                    ? 'bg-emerald-50 border-emerald-500'
                    : platform.status === 'too_loud'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-amber-50 border-amber-500'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{platform.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      platform.compatible
                        ? 'bg-emerald-100 text-emerald-800'
                        : platform.status === 'too_loud'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {platform.compatible
                      ? '符合标准'
                      : platform.status === 'too_loud'
                      ? '音量过大'
                      : '音量过小'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    目标范围: <span className="text-gray-900">{platform.target - 1} 至 {platform.target + 1} LUFS</span>
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    当前值: <span className="text-gray-900">{analysisResult.integratedLUFS.toFixed(1)} LUFS</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">响度曲线</h2>
          <div className="h-[400px]">
            <canvas id="loudnessChart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
} 