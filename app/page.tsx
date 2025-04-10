"use client";

import { useRouter } from 'next/navigation';
import FileUploader from '@/components/FileUpload/FileUploader';
import LufsFAQ from '@/components/FAQ/LufsFAQ';
import Header from '@/components/Layout/Header';
import Link from 'next/link';
import { FaMusic, FaUpload, FaQuestionCircle } from 'react-icons/fa';
import { analyzeAudio } from '@/services/audioAnalyzer';

export default function Home() {
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
    try {
      const result = await analyzeAudio(file);
      
      // 将结果存储到localStorage
      console.log('分析完成，准备存储结果:', result);
      console.log('integratedLUFS 类型:', typeof result.integratedLUFS);
      console.log('platformCompatibilities 类型:', typeof result.platformCompatibilities);
      localStorage.setItem('audioAnalysisResult', JSON.stringify(result));
      
      // 跳转到结果页面
      router.push('/results');
    } catch (err) {
      console.error(err instanceof Error ? err.message : '分析过程中发生错误');
    }
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
              <FileUploader onFileSelected={handleFileUpload} />
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
              <Link href="/results" style={{
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
              <Link href="/upload" style={{
                display: 'inline-block',
                backgroundColor: '#5046e5',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                开始分析
              </Link>
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
