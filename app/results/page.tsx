'use client';

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useRouter } from 'next/navigation';
import Header from '@/components/Layout/Header';
import { AudioAnalysisResult } from '@/types/audio';

export default function ResultsPage() {
  const chartRef = useRef<Chart | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 从 localStorage 获取分析结果
    const storedResult = localStorage.getItem('audioAnalysisResult');
    if (storedResult) {
      try {
        console.log('原始存储的数据:', storedResult);
        const parsedResult = JSON.parse(storedResult);
        console.log('解析后的数据:', parsedResult);
        console.log('integratedLUFS 类型:', typeof parsedResult.integratedLUFS);
        console.log('integratedLUFS 值:', parsedResult.integratedLUFS);
        console.log('platformCompatibilities 类型:', typeof parsedResult.platformCompatibilities);
        console.log('platformCompatibilities 值:', parsedResult.platformCompatibilities);
        
        // 详细验证每个字段
        const validationErrors = [];
        
        if (!parsedResult || typeof parsedResult !== 'object') {
          validationErrors.push('解析结果不是一个有效的对象');
        } else {
          // 文件信息验证
          if (typeof parsedResult.fileName !== 'string') validationErrors.push('fileName 必须是字符串类型');
          if (typeof parsedResult.fileSize !== 'number') validationErrors.push('fileSize 必须是数字类型');
          if (typeof parsedResult.fileType !== 'string') validationErrors.push('fileType 必须是字符串类型');
          if (typeof parsedResult.duration !== 'number') validationErrors.push('duration 必须是数字类型');
          
          // LUFS 数据验证
          if (typeof parsedResult.integratedLUFS !== 'number') validationErrors.push('integratedLUFS 必须是数字类型');
          if (!Array.isArray(parsedResult.shortTermLUFSData)) {
            validationErrors.push('shortTermLUFSData 必须是数组类型');
          } else if (parsedResult.shortTermLUFSData.some(v => typeof v !== 'number')) {
            validationErrors.push('shortTermLUFSData 数组的所有元素必须是数字类型');
          }
          if (typeof parsedResult.truePeak !== 'number') validationErrors.push('truePeak 必须是数字类型');
          if (typeof parsedResult.loudnessRange !== 'number') validationErrors.push('loudnessRange 必须是数字类型');
          
          // 平台兼容性验证
          if (!parsedResult.platformCompatibilities || typeof parsedResult.platformCompatibilities !== 'object') {
            validationErrors.push('platformCompatibilities 必须是一个对象');
          } else {
            const requiredPlatforms = ['spotify', 'youtube', 'appleMusic', 'tiktok', 'broadcast'];
            for (const platform of requiredPlatforms) {
              if (!parsedResult.platformCompatibilities[platform]) {
                validationErrors.push(`缺少平台 ${platform} 的兼容性数据`);
              } else {
                const platformData = parsedResult.platformCompatibilities[platform];
                if (typeof platformData.name !== 'string') validationErrors.push(`${platform}.name 必须是字符串类型`);
                if (typeof platformData.target !== 'number') validationErrors.push(`${platform}.target 必须是数字类型`);
                if (typeof platformData.compatible !== 'boolean') validationErrors.push(`${platform}.compatible 必须是布尔类型`);
                if (!['compatible', 'too_loud', 'too_quiet'].includes(platformData.status)) {
                  validationErrors.push(`${platform}.status 必须是 'compatible', 'too_loud' 或 'too_quiet' 之一`);
                }
              }
            }
          }
        }

        if (validationErrors.length === 0) {
          setAnalysisResult(parsedResult as AudioAnalysisResult);
        } else {
          console.error('数据验证错误:', validationErrors);
          setAnalysisResult(null);
        }
      } catch (error) {
        console.error('解析分析结果失败:', error);
        setAnalysisResult(null);
      }
    } else {
      console.log('未找到存储的分析结果');
      setAnalysisResult(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (analysisResult && analysisResult.shortTermLUFSData) {
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

  if (!analysisResult) {
    return (
      <>
        <Header activePage="results" onNavigate={handleNavigate} />
        <div className="container mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-6">未找到分析结果</h1>
            <p className="mb-4">请返回首页上传文件进行分析。</p>
            <button
              onClick={() => router.push('/')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              返回首页
            </button>
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