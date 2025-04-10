const LufsFAQ = () => {
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '40px auto',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      padding: '40px',
      color: '#333'
    }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#4338CA',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        常见问题解答 (FAQ)
      </h2>

      {/* 什么是LUFS */}
      <div style={{
        marginBottom: '36px',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#4338CA',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            backgroundColor: '#4338CA',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '12px',
            fontSize: '16px',
            fontWeight: '600'
          }}>Q</span>
          什么是LUFS?
        </h3>
        <div style={{
          paddingLeft: '44px',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4B5563'
        }}>
          <p style={{ marginBottom: '16px' }}>
            LUFS (Loudness Units Full Scale) 是一种测量音频响度的标准单位，它考虑了人耳对不同频率的感知差异，提供了比传统分贝测量更准确的音量感知指标。
          </p>
          <p>
            LUFS测量对于确保您的音频在不同平台上播放时保持一致的音量非常重要，因为大多数流媒体平台和广播标准都使用LUFS作为音量标准化的基础。
          </p>
        </div>
      </div>

      {/* 主要LUFS指标解释 */}
      <div style={{
        marginBottom: '36px',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#4338CA',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            backgroundColor: '#4338CA',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '12px',
            fontSize: '16px',
            fontWeight: '600'
          }}>Q</span>
          主要LUFS指标有哪些?
        </h3>
        <div style={{
          paddingLeft: '44px',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4B5563'
        }}>
          <ul style={{ 
            paddingLeft: '20px', 
            listStyleType: 'none' 
          }}>
            <li style={{ 
              marginBottom: '12px',
              position: 'relative',
              paddingLeft: '24px' 
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '9px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#6366F1'
              }}></span>
              <strong style={{ color: '#4338CA', fontWeight: '600' }}>集成响度 (Integrated LUFS):</strong> 整个音频文件的平均响度，这是最常用的LUFS指标。
            </li>
            <li style={{ 
              marginBottom: '12px',
              position: 'relative',
              paddingLeft: '24px' 
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '9px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#6366F1'
              }}></span>
              <strong style={{ color: '#4338CA', fontWeight: '600' }}>短期响度 (Short-term LUFS):</strong> 以3秒窗口测量的响度，反映短期音量变化。
            </li>
            <li style={{ 
              marginBottom: '12px',
              position: 'relative',
              paddingLeft: '24px' 
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '9px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#6366F1'
              }}></span>
              <strong style={{ color: '#4338CA', fontWeight: '600' }}>瞬时响度 (Momentary LUFS):</strong> 以400毫秒窗口测量的响度，反映即时音量变化。
            </li>
            <li style={{ 
              marginBottom: '12px',
              position: 'relative',
              paddingLeft: '24px' 
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '9px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#6366F1'
              }}></span>
              <strong style={{ color: '#4338CA', fontWeight: '600' }}>响度范围 (LRA):</strong> 测量音频动态范围的指标，以LU (Loudness Units) 为单位。
            </li>
            <li style={{ 
              marginBottom: '12px',
              position: 'relative',
              paddingLeft: '24px' 
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '9px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#6366F1'
              }}></span>
              <strong style={{ color: '#4338CA', fontWeight: '600' }}>真实峰值 (True Peak):</strong> 以dBTP (decibels True Peak) 为单位，测量音频信号的绝对峰值电平。
            </li>
          </ul>
        </div>
      </div>

      {/* 各平台LUFS标准 */}
      <div style={{
        marginBottom: '36px',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#4338CA',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            backgroundColor: '#4338CA',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '12px',
            fontSize: '16px',
            fontWeight: '600'
          }}>Q</span>
          各平台LUFS标准是什么?
        </h3>
        <div style={{
          paddingLeft: '44px',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4B5563'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '16px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#EEF2FF',
                  color: '#4338CA',
                  fontWeight: '600',
                  textAlign: 'left'
                }}>
                  <th style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>平台</th>
                  <th style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>目标LUFS</th>
                  <th style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>真实峰值限制</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: 'white' }}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>YouTube</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-14 LUFS</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-1.0 dBTP</td>
                </tr>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>Spotify</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-14 LUFS</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-1.0 dBTP</td>
                </tr>
                <tr style={{ backgroundColor: 'white' }}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>Apple Music</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-16 LUFS</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-1.0 dBTP</td>
                </tr>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>Netflix</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-24 LUFS</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-2.0 dBTP</td>
                </tr>
                <tr style={{ backgroundColor: 'white' }}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>广播标准 (EBU R128)</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-23 LUFS</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-1.0 dBTP</td>
                </tr>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>抖音/TikTok</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-14 LUFS</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7EB' }}>-1.0 dBTP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 如何使用本工具 */}
      <div style={{
        marginBottom: '36px'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#4338CA',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            backgroundColor: '#4338CA',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '12px',
            fontSize: '16px',
            fontWeight: '600'
          }}>Q</span>
          如何使用本工具?
        </h3>
        <div style={{
          paddingLeft: '44px',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4B5563'
        }}>
          <ol style={{ 
            paddingLeft: '20px', 
            counterReset: 'item',
            listStyleType: 'none'
          }}>
            <li style={{ 
              marginBottom: '20px',
              position: 'relative',
              paddingLeft: '36px',
              counterIncrement: 'item'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#6366F1',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>1</span>
              <strong style={{ color: '#4338CA', fontWeight: '600', display: 'block', marginBottom: '8px' }}>上传文件</strong>
              <p>在首页点击&quot;选择文件&quot;按钮或将文件拖放到指定区域。支持的格式包括MP3、WAV、FLAC、AAC、MP4、MOV和AVI。</p>
            </li>
            <li style={{ 
              marginBottom: '20px',
              position: 'relative',
              paddingLeft: '36px',
              counterIncrement: 'item'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#6366F1',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>2</span>
              <strong style={{ color: '#4338CA', fontWeight: '600', display: 'block', marginBottom: '8px' }}>等待分析</strong>
              <p>上传后，系统将自动分析您的文件。分析时间取决于文件大小和长度，通常只需几秒钟。</p>
            </li>
            <li style={{ 
              marginBottom: '20px',
              position: 'relative',
              paddingLeft: '36px',
              counterIncrement: 'item'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#6366F1',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>3</span>
              <strong style={{ color: '#4338CA', fontWeight: '600', display: 'block', marginBottom: '8px' }}>查看结果</strong>
              <p>分析完成后，您将看到详细的LUFS测量结果，包括响度曲线图、平台兼容性检查以及优化建议。</p>
            </li>
          </ol>
        </div>
      </div>

      {/* 主要功能卡片 */}
      <div style={{
        marginTop: '40px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#4338CA',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          主要功能
        </h3>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'center'
        }}>
          {/* 精确测量卡片 */}
          <div style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: '24px',
            textAlign: 'center',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }} 
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#6366F1' }}>
                <path d="M9 17H5a2 2 0 100 4h4a2 2 0 100-4zm0-8H5a2 2 0 100 4h4a2 2 0 100-4zm0-8H5a2 2 0 100 4h4a2 2 0 100-4zm10 0h-4a2 2 0 100 4h4a2 2 0 100-4zm0 8h-4a2 2 0 100 4h4a2 2 0 100-4zm0 8h-4a2 2 0 100 4h4a2 2 0 100-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#4338CA',
              marginBottom: '12px'
            }}>
              精确测量
            </h4>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#6B7280'
            }}>
              获取集成响度、真实峰值、响度范围等专业音频指标的精确测量
            </p>
          </div>

          {/* 可视化分析卡片 */}
          <div style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: '24px',
            textAlign: 'center',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#6366F1' }}>
                <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#4338CA',
              marginBottom: '12px'
            }}>
              可视化分析
            </h4>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#6B7280'
            }}>
              通过直观的图表和波形显示，轻松理解您的音频特性和问题区域
            </p>
          </div>

          {/* 平台兼容性卡片 */}
          <div style={{
            flex: '1 1 300px',
            maxWidth: '350px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: '24px',
            textAlign: 'center',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#6366F1' }}>
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#4338CA',
              marginBottom: '12px'
            }}>
              平台兼容性
            </h4>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#6B7280'
            }}>
              检查您的音频是否符合YouTube、Spotify、Netflix等平台的音量标准
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LufsFAQ; 