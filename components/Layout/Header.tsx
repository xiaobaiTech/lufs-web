// 移除 useState 导入

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Header = ({ activePage, onNavigate }: HeaderProps) => {
  // 移除未使用的状态变量
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{ 
      backgroundColor: '#5046e5', 
      color: 'white', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
      height: '80px',
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        {/* Logo 和标题区域 */}
        <div 
          onClick={() => onNavigate('home')}
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer'
          }}>
          {/* Logo */}
          <div style={{ 
            marginRight: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '8px',
            borderRadius: '8px',
            width: '60px',
            height: '60px',
            justifyContent: 'center'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white', marginBottom: '4px' }}>
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>LUFS</span>
          </div>

          {/* 标题和副标题 */}
          <div>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: 'bold', 
              margin: '0 0 4px 0', 
              lineHeight: '1.2',
              color: 'white'
            }}>
              LUFS检测器
            </h1>
            <p style={{ 
              fontSize: '14px', 
              margin: '0',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 'normal'
            }}>
              专业音视频LUFS分析工具
            </p>
          </div>
        </div>

        {/* 导航菜单 */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <button 
            onClick={() => onNavigate('home')}
            style={{ 
              backgroundColor: activePage === 'home' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            首页
          </button>
          {/* <button 
            onClick={() => onNavigate('history')}
            style={{ 
              backgroundColor: activePage === 'history' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'rgba(255,255,255,0.85)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            历史记录
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Header;