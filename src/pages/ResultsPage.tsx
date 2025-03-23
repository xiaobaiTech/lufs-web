import { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { AudioAnalysisResult, AnalysisStatus } from '../types/audio';

interface ResultsPageProps {
  file: File | null;
  onNavigate: (page: string) => void;
  analysisResult: AudioAnalysisResult | null;
  analysisStatus: AnalysisStatus;
  analysisError: string | null;
}

const ResultsPage = ({ file, onNavigate, analysisResult, analysisStatus, analysisError }: ResultsPageProps) => {
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  // 添加调试信息
  useEffect(() => {
    console.log('组件状态:', {
      analysisStatus,
      hasResult: !!analysisResult,
      hasFile: !!file,
      hasError: !!analysisError
    });

    if (analysisResult && analysisStatus === AnalysisStatus.SUCCESS) {
      console.log('准备初始化图表');
      const ctx = document.getElementById('loudnessChart') as HTMLCanvasElement | null;
      console.log('Canvas元素:', ctx);
      
      if (!ctx) {
        console.error('找不到Canvas元素');
        return;
      }

      // 清除之前的图表实例
      if (chartInstance) {
        console.log('销毁旧图表实例');
        chartInstance.destroy();
      }

      try {
        console.log('图表数据:', {
          dataPoints: analysisResult.shortTermLUFSData.length,
          shortTermData: analysisResult.shortTermLUFSData,
          integratedLoudness: analysisResult.integratedLoudness
        });

        // 使用分析结果中的数据
        const dataPoints = analysisResult.shortTermLUFSData.length;
        const labels = Array.from({length: dataPoints}, (_, i) => Math.ceil(i * (analysisResult.duration / dataPoints)));
        const shortTermData = analysisResult.shortTermLUFSData;
        const integratedData = Array(dataPoints).fill(analysisResult.integratedLoudness);

        console.log('创建新图表实例');
        const newChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: '短期响度',
                data: shortTermData,
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: '集成响度',
                data: integratedData,
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
                min: Math.floor(Math.min(...shortTermData, analysisResult.integratedLoudness) - 2),
                max: Math.ceil(Math.max(...shortTermData, analysisResult.integratedLoudness) + 2)
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

        setChartInstance(newChartInstance);
        console.log('图表创建完成');
      } catch (error) {
        console.error('图表创建失败:', error);
      }
    }
  }, [analysisResult, analysisStatus, chartInstance]);

  // 组件卸载时清除图表
  useEffect(() => {
    return () => {
      if (chartInstance) {
        console.log('组件卸载，清除图表');
        chartInstance.destroy();
      }
    };
  }, [chartInstance]);

  // 渲染初始状态
  if (analysisStatus === AnalysisStatus.IDLE) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <button onClick={() => onNavigate('home')} className="mr-4 text-indigo-600 hover:text-indigo-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">等待分析</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="text-indigo-600 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">请选择音频文件</h2>
              <p className="text-gray-600 text-center max-w-md">
                请返回首页选择要分析的音频文件，支持MP3、WAV、FLAC等格式。
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染加载状态
  if (analysisStatus === AnalysisStatus.LOADING) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <button onClick={() => onNavigate('home')} className="mr-4 text-indigo-600 hover:text-indigo-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">分析中...</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600 mb-8"></div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">正在分析您的文件</h2>
              <p className="text-gray-600 text-center max-w-md">
                我们正在处理您的音频文件并计算LUFS值，这可能需要几秒钟时间，请稍候...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (analysisError || analysisStatus === AnalysisStatus.ERROR) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <button onClick={() => onNavigate('home')} className="mr-4 text-indigo-600 hover:text-indigo-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">分析失败</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 bg-red-50 border-l-4 border-red-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">分析过程中出现错误</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{analysisError || '处理文件时发生未知错误'}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => onNavigate('home')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      返回重试
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有分析结果，返回空白页面
  if (!analysisResult) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <button onClick={() => onNavigate('home')} className="mr-4 text-indigo-600 hover:text-indigo-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">无分析结果</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="text-indigo-600 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">暂无分析结果</h2>
              <p className="text-gray-600 text-center max-w-md">
                请返回首页选择要分析的音频文件。
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染成功状态
  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 主内容容器 */}
      <main style={{ flex: 1, backgroundColor: '#f9fafb', padding: '32px 16px' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}>
            {/* 内容头部 */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button 
                  onClick={() => onNavigate('home')} 
                  style={{ 
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '16px',
                    padding: '4px',
                    color: '#4f46e5'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>分析结果</h2>
              </div>

              {/* 文件信息 */}
              <div style={{ 
                backgroundColor: '#f5f7ff', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '16px', color: '#4f46e5' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0', color: '#1f2937' }}>{file?.name || '未知文件'}</p>
                    <p style={{ fontSize: '14px', margin: 0, color: '#6b7280' }}>
                      {analysisResult ? `${Math.floor(analysisResult.duration / 60)}分${Math.floor(analysisResult.duration % 60)}秒 · ${(analysisResult.fileSize / (1024 * 1024)).toFixed(2)} MB · 分析完成` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* LUFS结果卡片 */}
              <div style={{ 
                backgroundColor: '#f5f7ff', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#1f2937' }}>LUFS测量结果</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* 集成响度 */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '8px' 
                    }}>
                      <span style={{ color: '#4b5563' }}>集成响度 (Integrated LUFS)</span>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4f46e5' }}>
                        {analysisResult ? analysisResult.integratedLoudness.toFixed(1) : '-14.3'} LUFS
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '9999px', 
                      height: '10px' 
                    }}>
                      <div style={{ 
                        backgroundColor: '#4f46e5', 
                        height: '10px', 
                        borderRadius: '9999px', 
                        width: '85%' 
                      }}></div>
                    </div>
                  </div>

                  {/* 短期响度 */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '8px' 
                    }}>
                      <span style={{ color: '#4b5563' }}>短期响度 (Short-term LUFS)</span>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4f46e5' }}>
                        {analysisResult ? analysisResult.shortTermLoudness.toFixed(1) : '-13.8'} LUFS
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '9999px', 
                      height: '10px' 
                    }}>
                      <div style={{ 
                        backgroundColor: '#4f46e5', 
                        height: '10px', 
                        borderRadius: '9999px', 
                        width: '87%' 
                      }}></div>
                    </div>
                  </div>

                  {/* 真实峰值 */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '8px' 
                    }}>
                      <span style={{ color: '#4b5563' }}>真实峰值 (True Peak)</span>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>
                        {analysisResult ? analysisResult.truePeak.toFixed(1) : '-0.8'} dBTP
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '9999px', 
                      height: '10px' 
                    }}>
                      <div style={{ 
                        backgroundColor: '#dc2626', 
                        height: '10px', 
                        borderRadius: '9999px', 
                        width: '95%' 
                      }}></div>
                    </div>
                  </div>

                  {/* 响度范围 */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '8px' 
                    }}>
                      <span style={{ color: '#4b5563' }}>响度范围 (LRA)</span>
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                        {analysisResult ? analysisResult.loudnessRange.toFixed(1) : '8.2'} LU
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '9999px', 
                      height: '10px' 
                    }}>
                      <div style={{ 
                        backgroundColor: '#10b981', 
                        height: '10px', 
                        borderRadius: '9999px', 
                        width: '65%' 
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 响度曲线 */}
              <div style={{ 
                backgroundColor: '#f5f7ff', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#1f2937' }}>响度曲线</h3>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ height: '250px', width: '100%' }}>
                    <canvas id="loudnessChart"></canvas>
                  </div>
                </div>
              </div>

              {/* 平台兼容性 */}
              <div style={{ 
                backgroundColor: '#f5f7ff', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#1f2937' }}>平台兼容性</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                  {/* Spotify */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '4px solid #1DB954'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#4b5563' }}>Spotify</span>
                      <span style={{ 
                        backgroundColor: analysisResult?.platformCompatibility.spotify.compatible ? '#dcfce7' : '#fee2e2',
                        color: analysisResult?.platformCompatibility.spotify.compatible ? '#16a34a' : '#dc2626',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {analysisResult?.platformCompatibility.spotify.compatible ? '符合标准' : '不符合标准'}
                      </span>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>目标: {analysisResult?.platformCompatibility.spotify.target} LUFS</span>
                  </div>

                  {/* YouTube */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '4px solid #FF0000'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#4b5563' }}>YouTube</span>
                      <span style={{ 
                        backgroundColor: analysisResult?.platformCompatibility.youtube.compatible ? '#dcfce7' : '#fee2e2',
                        color: analysisResult?.platformCompatibility.youtube.compatible ? '#16a34a' : '#dc2626',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {analysisResult?.platformCompatibility.youtube.compatible ? '符合标准' : '不符合标准'}
                      </span>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>目标: {analysisResult?.platformCompatibility.youtube.target} LUFS</span>
                  </div>

                  {/* Apple Music */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '4px solid #FC3C44'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#4b5563' }}>Apple Music</span>
                      <span style={{ 
                        backgroundColor: analysisResult?.platformCompatibility.appleMusic.compatible ? '#dcfce7' : '#fee2e2',
                        color: analysisResult?.platformCompatibility.appleMusic.compatible ? '#16a34a' : '#dc2626',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {analysisResult?.platformCompatibility.appleMusic.compatible ? '符合标准' : '不符合标准'}
                      </span>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>目标: {analysisResult?.platformCompatibility.appleMusic.target} LUFS</span>
                  </div>

                  {/* 抖音/TikTok */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '4px solid #000000'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#4b5563' }}>抖音/TikTok</span>
                      <span style={{ 
                        backgroundColor: analysisResult?.platformCompatibility.tiktok.compatible ? '#dcfce7' : '#fee2e2',
                        color: analysisResult?.platformCompatibility.tiktok.compatible ? '#16a34a' : '#dc2626',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {analysisResult?.platformCompatibility.tiktok.compatible ? '符合标准' : '不符合标准'}
                      </span>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>目标: {analysisResult?.platformCompatibility.tiktok.target} LUFS</span>
                  </div>

                  {/* 广播 */}
                  <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#4b5563' }}>广播标准</span>
                      <span style={{ 
                        backgroundColor: analysisResult?.platformCompatibility.broadcast.compatible ? '#dcfce7' : '#fee2e2',
                        color: analysisResult?.platformCompatibility.broadcast.compatible ? '#16a34a' : '#dc2626',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {analysisResult?.platformCompatibility.broadcast.compatible ? '符合标准' : '不符合标准'}
                      </span>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>目标: {analysisResult?.platformCompatibility.broadcast.target} LUFS</span>
                  </div>
                </div>
              </div>

              {/* 建议 */}
              <div style={{ 
                backgroundColor: '#ebf5ff', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #dbeafe'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ 
                    color: '#3b82f6', 
                    marginRight: '16px',
                    backgroundColor: 'white',
                    padding: '8px',
                    borderRadius: '50%'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#1f2937' }}>优化建议</h3>
                    <ul style={{ 
                      color: '#4b5563', 
                      paddingLeft: '20px',
                      margin: '0',
                      listStyleType: 'disc'
                    }}>
                      {analysisResult?.integratedLoudness > -12 && (
                        <li style={{ marginBottom: '8px' }}>您的音频文件整体响度偏高，可能会在某些平台上被自动降低音量。</li>
                      )}
                      {analysisResult?.integratedLoudness < -18 && (
                        <li style={{ marginBottom: '8px' }}>您的音频文件整体响度偏低，可能会在某些平台上听起来较安静。</li>
                      )}
                      {analysisResult?.truePeak > -1 && (
                        <li style={{ marginBottom: '8px' }}>真实峰值接近0dB，建议降低{(analysisResult.truePeak + 2).toFixed(1)}dB以避免失真。</li>
                      )}
                      {analysisResult?.loudnessRange < 5 && (
                        <li style={{ marginBottom: '8px' }}>响度范围较窄，动态范围较小，可考虑增加动态变化。</li>
                      )}
                      {analysisResult?.loudnessRange > 10 && (
                        <li style={{ marginBottom: '8px' }}>响度范围较宽，动态变化较大，可能需要适当压缩。</li>
                      )}
                      {analysisResult?.platformCompatibility.broadcast.compatible === false && (
                        <li style={{ marginBottom: '8px' }}>
                          如需用于广播，需要{analysisResult.platformCompatibility.broadcast.status === 'too_loud' ? '降低' : '提高'}整体响度约{Math.abs(Math.round(analysisResult.integratedLoudness - (-23)))}dB。
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* 底部按钮 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '32px', 
                paddingTop: '16px', 
                borderTop: '1px solid #e5e7eb' 
              }}>
                <button
                  onClick={() => {
                    if (!analysisResult) return;
                    
                    // 创建报告文本内容
                    const reportContent = `
音频分析报告 - LUFS检测器
===============================

文件信息:
文件名: ${analysisResult.fileName}
文件大小: ${(analysisResult.fileSize / (1024 * 1024)).toFixed(2)} MB
文件类型: ${analysisResult.fileType}
时长: ${Math.floor(analysisResult.duration / 60)}分${Math.floor(analysisResult.duration % 60)}秒

LUFS测量结果:
集成响度 (Integrated LUFS): ${analysisResult.integratedLoudness.toFixed(1)} LUFS
短期响度 (Short-term LUFS): ${analysisResult.shortTermLoudness.toFixed(1)} LUFS
真实峰值 (True Peak): ${analysisResult.truePeak.toFixed(1)} dBTP
响度范围 (LRA): ${analysisResult.loudnessRange.toFixed(1)} LU

平台兼容性:
${Object.entries(analysisResult.platformCompatibility)
.map(([_, platform]) => `- ${platform.name} (${platform.target} LUFS): ${platform.compatible ? '符合标准' : '不符合标准'}`)
.join('\n')}

建议:
${analysisResult.integratedLoudness > -12 ? '- 您的音频文件整体响度偏高，可能会在某些平台上被自动降低音量\n' : ''}${analysisResult.integratedLoudness < -18 ? '- 您的音频文件整体响度偏低，可能会在某些平台上听起来较安静\n' : ''}${analysisResult.truePeak > -1 ? `- 真实峰值接近0dB，建议降低${(analysisResult.truePeak + 2).toFixed(1)}dB以避免失真\n` : ''}${analysisResult.loudnessRange < 5 ? '- 响度范围较窄，动态范围较小，可考虑增加动态变化\n' : ''}${analysisResult.loudnessRange > 10 ? '- 响度范围较宽，动态变化较大，可能需要适当压缩\n' : ''}

分析日期: ${new Date().toLocaleString()}
                    `;
                    
                    // 创建Blob对象
                    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
                    
                    // 创建下载链接
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `LUFS分析报告_${analysisResult.fileName.split('.')[0]}.txt`;
                    
                    // 触发下载
                    document.body.appendChild(link);
                    link.click();
                    
                    // 清理
                    setTimeout(() => {
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }, 100);
                  }}
                  style={{ 
                    backgroundColor: '#4f46e5', 
                    color: 'white', 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    fontWeight: '500',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  下载分析报告
                </button>
                
                <button
                  onClick={() => onNavigate('home')}
                  style={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #4f46e5', 
                    color: '#4f46e5', 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  分析新文件
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;