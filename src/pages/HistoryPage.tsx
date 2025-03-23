import { useState, useEffect } from 'react';

interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  integratedLoudness: string;
  truePeak: string;
  fileId?: string; // 关联到实际文件的ID
}

const HistoryPage = () => {
  // 使用useState初始化为空数组，而不是硬编码的数据
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  
  // 使用useEffect在组件加载时从localStorage获取历史记录
  useEffect(() => {
    // 从localStorage获取保存的历史记录
    const savedHistory = localStorage.getItem('lufsAnalysisHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistoryItems(parsedHistory);
      } catch (error) {
        console.error('无法解析历史记录:', error);
        // 如果解析失败，可以设置一些示例数据或清空
        setHistoryItems([]);
      }
    }
  }, []);

  // 处理查看按钮点击
  const handleView = (id: string) => {
    // 查找对应的历史记录项
    const item = historyItems.find(item => item.id === id);
    if (item && item.fileId) {
      // 使用文件ID导航到结果页面
      window.location.href = `/results/${item.fileId}`;
    } else {
      // 如果没有关联的文件ID，使用历史记录ID
      window.location.href = `/results/${id}`;
    }
    console.log(`查看记录: ${id}`);
  };

  // 处理删除按钮点击
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？此操作不可恢复。')) {
      // 从列表中过滤掉要删除的项目
      const updatedHistory = historyItems.filter(item => item.id !== id);
      setHistoryItems(updatedHistory);
      
      // 更新本地存储
      localStorage.setItem('lufsAnalysisHistory', JSON.stringify(updatedHistory));
      
      console.log(`删除记录: ${id}`);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '36px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(80, 70, 229, 0.1)',
            left: '-80px',
            top: '-10px',
            zIndex: 0
          }}></div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#2D3748',
            margin: '0',
            position: 'relative'
          }}>
            历史分析记录
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '0',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #5046e5 0%, rgba(80, 70, 229, 0.2) 100%)',
              borderRadius: '2px'
            }}></div>
          </h1>
        </div>
        
        {historyItems.length > 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            marginBottom: '36px',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            {historyItems.map((item, index) => (
              <div key={item.id} style={{
                padding: '20px 24px',
                borderBottom: index === historyItems.length - 1 ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                backgroundColor: index % 2 === 0 ? 'white' : '#f9fafc',
                position: 'relative'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  flexShrink: 0,
                  marginRight: '20px',
                  backgroundColor: '#f0f0f8',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: '#5046e5' }}>
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div style={{
                  flex: '1',
                  minWidth: '0'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2D3748',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {item.fileName}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#718096',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item.date}
                    </span>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(80, 70, 229, 0.08)',
                    borderRadius: '40px',
                    color: '#5046e5',
                    fontWeight: '600',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ marginRight: '6px' }}>集成响度:</span>
                    {item.integratedLoudness}
                  </div>
                  
                  <div style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(72, 187, 120, 0.08)',
                    borderRadius: '40px',
                    color: '#38a169',
                    fontWeight: '600',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ marginRight: '6px' }}>真实峰值:</span>
                    {item.truePeak}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button 
                      onClick={() => handleView(item.id)}
                      style={{
                        backgroundColor: '#5046e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      查看
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(item.id)}
                      style={{
                        backgroundColor: 'rgba(229, 62, 62, 0.1)',
                        color: '#e53e3e',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '36px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              backgroundColor: 'rgba(80, 70, 229, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: '#5046e5' }}>
                <path d="M9 13h6m-3-3v6m-7 3h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2D3748',
              marginBottom: '12px'
            }}>暂无历史记录</h3>
            <p style={{
              fontSize: '16px',
              color: '#718096',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              您还没有分析过任何音频文件。上传文件并分析后，结果将显示在这里。
            </p>
          </div>
        )}
        
        <div style={{
          backgroundColor: 'rgba(80, 70, 229, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          border: '1px solid rgba(80, 70, 229, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            right: '-30px',
            bottom: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: 'rgba(80, 70, 229, 0.06)',
            zIndex: 0
          }}></div>
          
          <div style={{
            backgroundColor: 'rgba(80, 70, 229, 0.1)',
            borderRadius: '12px',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            flexShrink: 0,
            zIndex: 1
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: '#5046e5' }}>
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div style={{ zIndex: 1 }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#4338ca',
              marginTop: 0,
              marginBottom: '12px'
            }}>
              历史记录存储
            </h3>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#5046e5',
              margin: '0 0 10px 0'
            }}>
              您的分析历史记录将存储在本地浏览器中，清除浏览器数据可能会导致历史记录丢失。
            </p>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#5046e5',
              margin: 0
            }}>
              如需永久保存分析结果，请使用"下载分析报告"功能。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage; 