'use client';

import React from 'react';
import { FaQuestionCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const LufsFAQ = () => {
  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '40px 20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '32px',
          color: '#5046e5',
          marginBottom: '16px'
        }}>LUFS 常见问题</h1>
        <div style={{
          width: '60px',
          height: '4px',
          backgroundColor: '#5046e5',
          margin: '0 auto'
        }} />
      </div>

      <div style={{
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#5046e5',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            flexShrink: 0
          }}>
            <FaQuestionCircle />
          </div>
          <h2 style={{
            fontSize: '20px',
            color: '#1f2937',
            margin: 0
          }}>什么是 LUFS？</h2>
        </div>
        <div style={{
          marginLeft: '48px',
          color: '#4b5563',
          lineHeight: '1.6'
        }}>
          LUFS（Loudness Units relative to Full Scale）是一种用于测量音频响度的标准单位。它考虑了人耳对声音的感知特性，比传统的峰值电平测量更准确地反映音频的实际响度。
        </div>
      </div>

      <div style={{
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#5046e5',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            flexShrink: 0
          }}>
            <FaQuestionCircle />
          </div>
          <h2 style={{
            fontSize: '20px',
            color: '#1f2937',
            margin: 0
          }}>为什么 LUFS 很重要？</h2>
        </div>
        <div style={{
          marginLeft: '48px',
          color: '#4b5563',
          lineHeight: '1.6'
        }}>
          <p style={{ marginBottom: '16px' }}>
            LUFS 对于音频制作和分发非常重要，原因如下：
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <FaCheckCircle style={{ color: '#10b981', marginRight: '12px' }} />
              <span>确保音频在不同平台上的响度一致</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <FaCheckCircle style={{ color: '#10b981', marginRight: '12px' }} />
              <span>避免音频过载或过弱</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <FaCheckCircle style={{ color: '#10b981', marginRight: '12px' }} />
              <span>提高听众体验</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaCheckCircle style={{ color: '#10b981', marginRight: '12px' }} />
              <span>符合各平台的音频标准</span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#5046e5',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            flexShrink: 0
          }}>
            <FaQuestionCircle />
          </div>
          <h2 style={{
            fontSize: '20px',
            color: '#1f2937',
            margin: 0
          }}>不同平台的 LUFS 标准是什么？</h2>
        </div>
        <div style={{
          marginLeft: '48px',
          color: '#4b5563',
          lineHeight: '1.6'
        }}>
          <div style={{
            overflowX: 'auto',
            marginTop: '16px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f3f4f6'
                }}>
                  <th style={{
                    padding: '12px',
                    borderBottom: '2px solid #e5e7eb'
                  }}>平台</th>
                  <th style={{
                    padding: '12px',
                    borderBottom: '2px solid #e5e7eb'
                  }}>目标 LUFS</th>
                  <th style={{
                    padding: '12px',
                    borderBottom: '2px solid #e5e7eb'
                  }}>最大真峰值</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{
                  backgroundColor: 'white'
                }}>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Spotify</td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>-14 LUFS</td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>-1 dBTP</td>
                </tr>
                <tr style={{
                  backgroundColor: '#f9fafb'
                }}>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Apple Music</td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>-16 LUFS</td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>-1 dBTP</td>
                </tr>
                <tr style={{
                  backgroundColor: 'white'
                }}>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>YouTube</td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>-14 LUFS</td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>-1 dBTP</td>
                </tr>
                <tr style={{
                  backgroundColor: '#f9fafb'
                }}>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>Amazon Music</td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>-14 LUFS</td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>-2 dBTP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#5046e5',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            flexShrink: 0
          }}>
            <FaQuestionCircle />
          </div>
          <h2 style={{
            fontSize: '20px',
            color: '#1f2937',
            margin: 0
          }}>如何优化音频的 LUFS 值？</h2>
        </div>
        <div style={{
          marginLeft: '48px',
          color: '#4b5563',
          lineHeight: '1.6'
        }}>
          <p style={{ marginBottom: '16px' }}>
            要优化音频的 LUFS 值，您可以：
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <FaExclamationTriangle style={{ color: '#f59e0b', marginRight: '12px' }} />
              <span>使用专业的音频处理软件</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <FaExclamationTriangle style={{ color: '#f59e0b', marginRight: '12px' }} />
              <span>使用 LUFS 测量工具监控响度</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <FaExclamationTriangle style={{ color: '#f59e0b', marginRight: '12px' }} />
              <span>避免过度压缩</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaExclamationTriangle style={{ color: '#f59e0b', marginRight: '12px' }} />
              <span>保持适当的动态范围</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LufsFAQ; 