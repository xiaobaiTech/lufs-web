"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/FileUpload/FileUploader';
import LufsFAQ from '@/components/FAQ/LufsFAQ';
import Header from '@/components/Layout/Header';
import Link from 'next/link';
import { FaMusic, FaUpload, FaQuestionCircle } from 'react-icons/fa';
import { analyzeAudio } from '@/services/audioAnalyzer';

export default function Home() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      // 清除之前的错误
      setError(null);
      
      // 检查文件大小
      if (file.size > 1024 * 1024 * 1024) { // 1GB限制
        setError('文件过大，请上传小于1GB的文件');
        return;
      }
      
      // 检查文件类型
      const validAudioFormats = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mpeg', 'audio/m4a', 'audio/x-m4a'];
      const validVideoFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      const validFormats = [...validAudioFormats, ...validVideoFormats];
      
      if (!validFormats.includes(file.type)) {
        setError('不支持的文件格式，请上传MP3、WAV、FLAC、AAC或MP4格式的文件');
        return;
      }
      
      setIsAnalyzing(true);
      setProgress(0);
      setTimeoutWarning(false);
      
      // 设置一个警告定时器（20秒后显示警告）
      warningTimeoutRef.current = setTimeout(() => {
        setTimeoutWarning(true);
      }, 20000);
      
      // 设置一个模拟进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // 最多到95%，留5%给最终完成
          const newProgress = prev + (95 - prev) * 0.1;
          return newProgress > 94 ? 94 : newProgress;
        });
      }, 1000);
      
      // 保存当前worker引用，以便可以取消
      const { worker, resultPromise } = analyzeAudio(file);
      workerRef.current = worker;
      
      // 设置超时处理
      let analysisDone = false;
      
      // 创建promise竞赛，一个是实际结果，一个是超时
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          if (!analysisDone) {
            reject(new Error('分析超时，可能是文件过大或浏览器内存不足'));
          }
        }, 120000); // 2分钟超时
      });
      
      try {
        // 使用Promise.race同时等待结果和超时
        const result = await Promise.race([resultPromise, timeoutPromise]);
        analysisDone = true;
        
        setProgress(100);
        
        if ('error' in result) {
          setError(result.error as string);
          return;
        }
        
        // 清理定时器
        clearInterval(progressInterval);
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        // 确保所有必需字段都存在并且类型正确
        if (typeof result.fileName !== 'string' || typeof result.fileSize !== 'number' || 
            typeof result.integratedLUFS !== 'number' || !Array.isArray(result.shortTermLUFSData)) {
          throw new Error('分析结果缺少必要字段或格式不正确');
        }
        
        // 将结果存储到localStorage - 使用try-catch确保不会因为localStorage错误导致整个过程失败
        try {
          localStorage.setItem('audioAnalysisResult', JSON.stringify(result));
        } catch (storageError) {
          console.error('存储到localStorage失败:', storageError);
          // 即使存储失败也继续跳转，因为我们有结果对象
        }
        
        // 跳转到结果页面
        router.push('/results');
      } catch (err) {
        clearInterval(progressInterval);
        throw err;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '分析过程中发生错误';
      console.error('分析错误:', errorMessage);
      
      // 常见错误的友好提示
      if (errorMessage.includes('OfflineAudioContext') || errorMessage.includes('AudioContext')) {
        setError('您的浏览器可能不支持音频分析功能。请尝试使用Chrome或Firefox最新版本。');
      } else if (errorMessage.includes('超时')) {
        setError('分析超时，请尝试上传较小的文件或减少文件时长。');
      } else if (errorMessage.includes('解码失败') || errorMessage.includes('音频解码')) {
        if (file.type === 'video/quicktime' || file.name.toLowerCase().endsWith('.mov')) {
          setError('MOV格式需要特殊处理。请尝试：1. 使用更新版本的浏览器 2. 将文件转换为MP4、WAV或MP3格式 3. 使用专业软件提取音频轨道');
        } else {
          setError('无法解码音频文件，文件可能已损坏或格式不受支持。请尝试转换为WAV或MP3格式后再上传。');
        }
      } else {
        setError(`分析失败: ${errorMessage}`);
      }
    } finally {
      setIsAnalyzing(false);
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        setTimeoutWarning(false);
      }
    }
  };

  const handleCancel = () => {
    if (workerRef.current) {
      // 终止Worker
      workerRef.current.terminate();
      workerRef.current = null;
    }
    
    // 清理定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    // 重置状态
    setIsAnalyzing(false);
    setError(null);
    setTimeoutWarning(false);
    setProgress(0);
  };

  // 定义 onNavigate 函数，使用 Next.js 的路由
  const handleNavigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else if (page === 'results') {
      router.push('/results');
    }
  };

  return (
    <>
      <Header activePage="home" onNavigate={handleNavigate} />
      <div className="container mx-auto px-4 py-12" style={{ maxWidth: '1200px', padding: '40px 20px' }}>
        <div className="max-w-4xl mx-auto" style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div className="text-center mb-16" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 className="text-5xl font-bold text-[#4338CA] mb-6" style={{ fontSize: '48px', fontWeight: 700, color: '#5046e5', marginBottom: '20px' }}>专业音视频LUFS检测工具</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '20px', color: '#4b5563', maxWidth: '800px', margin: '0 auto' }}>上传您的音视频文件，获取精确的LUFS测量结果和平台兼容性分析</p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10" style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', marginBottom: '2.5rem' }}>
            <div className="p-8" style={{ padding: '2rem' }}>
              <FileUploader onFileSelected={handleFileUpload} isProcessing={isAnalyzing} />
              
              {isAnalyzing && (
                <div className="text-center mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="spinner w-10 h-10 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-600">正在分析音频，请稍候...</p>
                  <p className="text-sm text-gray-500 mt-1">分析大文件可能需要较长时间，请不要关闭此窗口</p>
                  
                  {timeoutWarning && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                      <p>分析正在进行中，但需要更长时间。请继续等待或取消操作。</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleCancel}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                  >
                    取消分析
                  </button>
                </div>
              )}
              
              {error && (
                <div className="text-red-500 mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                  <p className="font-medium">分析失败</p>
                  <p className="text-sm">{error}</p>
                  <button 
                    onClick={() => {
                      setError(null);
                      // 重置整个组件状态，回到初始状态
                      setIsAnalyzing(false);
                      setProgress(0);
                      setTimeoutWarning(false);
                      if (workerRef.current) {
                        workerRef.current.terminate();
                        workerRef.current = null;
                      }
                    }}
                    className="mt-2 px-3 py-1 bg-white text-red-600 rounded border border-red-300 text-sm hover:bg-red-50"
                  >
                    关闭
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div className="text-[#6366F1] mb-6" style={{ color: '#6366F1', marginBottom: '1.5rem' }}>
                <div className="w-20 h-20 bg-[#5046e5] rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#5046e5', borderRadius: '50%', width: '80px', height: '80px', margin: '0 auto 20px' }}>
                  <FaMusic style={{ fontSize: '40px', color: 'white' }} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#4338CA]" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '0.75rem', color: '#4338CA' }}>平台兼容性</h3>
              <p className="text-gray-600 leading-relaxed" style={{ color: '#4B5563', lineHeight: '1.6' }}>检查您的音频是否符合YouTube、Spotify、Netflix等平台的音量标准</p>
              <Link href="/faq" style={{
                display: 'inline-block',
                backgroundColor: '#5046e5',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                查看标准
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div className="text-[#6366F1] mb-6" style={{ color: '#6366F1', marginBottom: '1.5rem' }}>
                <div className="w-20 h-20 bg-[#5046e5] rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#5046e5', borderRadius: '50%', width: '80px', height: '80px', margin: '0 auto 20px' }}>
                  <FaUpload style={{ fontSize: '40px', color: 'white' }} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#4338CA]" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '0.75rem', color: '#4338CA' }}>文件分析</h3>
              <p className="text-gray-600 leading-relaxed" style={{ color: '#4B5563', lineHeight: '1.6' }}>上传音频文件，获取详细的响度分析报告</p>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#5046e5',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                开始分析
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div className="text-[#6366F1] mb-6" style={{ color: '#6366F1', marginBottom: '1.5rem' }}>
                <div className="w-20 h-20 bg-[#5046e5] rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#5046e5', borderRadius: '50%', width: '80px', height: '80px', margin: '0 auto 20px' }}>
                  <FaQuestionCircle style={{ fontSize: '40px', color: 'white' }} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#4338CA]" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '0.75rem', color: '#4338CA' }}>常见问题</h3>
              <p className="text-gray-600 leading-relaxed" style={{ color: '#4B5563', lineHeight: '1.6' }}>了解 LUFS 相关知识和最佳实践</p>
              <Link href="/faq" style={{
                display: 'inline-block',
                backgroundColor: '#5046e5',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                查看 FAQ
              </Link>
            </div>
          </div>
        </div>

        <LufsFAQ />
      </div>
    </>
  );
}
