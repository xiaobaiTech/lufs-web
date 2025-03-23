import FileUploader from '../components/FileUpload/FileUploader';
import LufsFAQ from '../components/FAQ/LufsFAQ';

interface HomePageProps {
  onFileSelected: (file: File) => void;
}

const HomePage = ({ onFileSelected }: HomePageProps) => {
  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth: '100%', padding: '3rem 1rem' }}>
      <div className="max-w-4xl mx-auto" style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <div className="text-center mb-16" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="text-5xl font-bold text-[#4338CA] mb-6" style={{ fontSize: '3rem', fontWeight: 700, color: '#4338CA', marginBottom: '1.5rem' }}>专业音视频LUFS检测工具</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.25rem', color: '#4B5563', maxWidth: '42rem', margin: '0 auto' }}>上传您的音视频文件，获取精确的LUFS测量结果和平台兼容性分析</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10" style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div className="p-8" style={{ padding: '2rem' }}>
            <FileUploader onFileSelected={onFileSelected} />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '2rem', marginTop: '4rem' }}>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', transition: 'box-shadow 0.3s' }}>
            <div className="text-[#6366F1] mb-6" style={{ color: '#6366F1', marginBottom: '1.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', width: '3rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#4338CA]" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#4338CA' }}>精确测量</h3>
            <p className="text-gray-600 leading-relaxed" style={{ color: '#4B5563', lineHeight: '1.625' }}>获取集成响度、真实峰值、响度范围等专业音频指标的精确测量</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', transition: 'box-shadow 0.3s' }}>
            <div className="text-[#6366F1] mb-6" style={{ color: '#6366F1', marginBottom: '1.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', width: '3rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#4338CA]" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#4338CA' }}>可视化分析</h3>
            <p className="text-gray-600 leading-relaxed" style={{ color: '#4B5563', lineHeight: '1.625' }}>通过直观的图表和波形显示，轻松理解您的音频特性和问题区域</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', transition: 'box-shadow 0.3s' }}>
            <div className="text-[#6366F1] mb-6" style={{ color: '#6366F1', marginBottom: '1.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', width: '3rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#4338CA]" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#4338CA' }}>平台兼容性</h3>
            <p className="text-gray-600 leading-relaxed" style={{ color: '#4B5563', lineHeight: '1.625' }}>检查您的音频是否符合YouTube、Spotify、Netflix等平台的音量标准</p>
          </div>
        </div>
      </div>

      {/* 替换原有的常见问题部分，使用LufsFAQ组件 */}
      <LufsFAQ />
    </div>
  );
};

export default HomePage;