import { useState } from 'react';
import './App.css';
import Header from './components/Layout/Header';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import { analyzeAudio } from './services/audioAnalyzer';
import { AudioAnalysisResult, AnalysisStatus } from './types/audio';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setAnalysisStatus(AnalysisStatus.LOADING);
    setAnalysisError(null);
    
    try {
      // 分析音频文件
      const result = await analyzeAudio(file);
      
      // 添加文件信息
      result.fileName = file.name;
      result.fileSize = file.size;
      result.fileType = file.type;
      
      setAnalysisResult(result);
      setAnalysisStatus(AnalysisStatus.SUCCESS);
      setActivePage('results');
    } catch (error) {
      console.error('音频分析失败:', error);
      setAnalysisError(error instanceof Error ? error.message : '未知错误');
      setAnalysisStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activePage={activePage} onNavigate={handleNavigate} />
      <main style={{ flex: '1 0 auto' }}>
        {activePage === 'home' && (
          <HomePage onFileSelected={handleFileSelected} />
        )}
        
        {activePage === 'results' && (
          <ResultsPage 
            file={selectedFile} 
            onNavigate={handleNavigate} 
            analysisResult={analysisResult}
            analysisStatus={analysisStatus}
            analysisError={analysisError}
          />
        )}
        
        {activePage === 'history' && (
          <HistoryPage />
        )}
        
      
      </main>
      <footer style={{ 
        backgroundColor: 'white', 
        borderTop: '1px solid #e5e7eb',
        padding: '24px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>© 2025 LUFS检测器. 小白debug 保留所有权利.</p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/privacy" style={{ color: '#6b7280', fontSize: '14px', textDecoration: 'none' }}>隐私政策</a>
            <a href="/terms" style={{ color: '#6b7280', fontSize: '14px', textDecoration: 'none' }}>使用条款</a>
            <a href="/contact" style={{ color: '#6b7280', fontSize: '14px', textDecoration: 'none' }}>联系我们</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
