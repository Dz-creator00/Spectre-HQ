export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', Arial, sans-serif;
            background: #000;
            color: #fff;
            line-height: 1.6;
          }
          .app-container { 
            display: flex; 
            height: 100vh; 
            overflow: hidden;
          }
          .sidebar { 
            width: 280px; 
            background: #0f0f0f; 
            border-right: 1px solid #1f1f1f; 
            display: flex; 
            flex-direction: column;
            box-shadow: 2px 0 8px rgba(0,0,0,0.5);
          }
          .logo-section { 
            padding: 32px 24px; 
            border-bottom: 1px solid #1f1f1f; 
          }
          .logo-circle { 
            width: 48px; 
            height: 48px; 
            background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%); 
            border-radius: 12px; 
            display: inline-flex; 
            align-items: center; 
            justify-content: center; 
            color: #000; 
            font-weight: 700; 
            font-size: 20px;
            margin-bottom: 12px;
            box-shadow: 0 4px 12px rgba(255,255,255,0.1);
          }
          .logo-text { 
            font-size: 20px; 
            font-weight: 700; 
            letter-spacing: -0.5px;
          }
          .logo-subtitle { 
            font-size: 13px; 
            color: #666; 
            margin-top: 4px;
          }
          .nav-section { 
            flex: 1; 
            padding: 24px 16px; 
            overflow-y: auto;
          }
          .nav-item { 
            display: flex; 
            align-items: center; 
            gap: 14px; 
            padding: 14px 16px; 
            margin: 6px 0; 
            border-radius: 10px; 
            color: #aaa; 
            cursor: pointer; 
            border: none; 
            background: none; 
            width: 100%; 
            text-align: left; 
            font-size: 15px; 
            font-weight: 500;
            transition: all 0.2s ease;
          }
          .nav-item:hover { 
            background: #1a1a1a; 
            color: #fff;
            transform: translateX(2px);
          }
          .nav-icon { 
            font-size: 18px; 
            width: 24px; 
            text-align: center;
          }
          .user-section { 
            padding: 20px; 
            border-top: 1px solid #1f1f1f; 
            background: #0a0a0a;
          }
          .user-info { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            margin-bottom: 16px;
            padding: 12px;
            background: #141414;
            border-radius: 10px;
          }
          .user-avatar { 
            width: 44px; 
            height: 44px; 
            background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%); 
            border-radius: 10px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #000; 
            font-weight: 700; 
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(255,255,255,0.1);
          }
          .user-details { flex: 1; }
          .user-name { 
            font-weight: 600; 
            font-size: 14px; 
            margin-bottom: 2px;
          }
          .user-email { 
            font-size: 12px; 
            color: #666;
          }
          .sign-out-btn {
            width: 100%;
            padding: 12px 16px;
            background: #141414;
            border: 1px solid #1f1f1f;
            border-radius: 8px;
            color: #aaa;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .sign-out-btn:hover {
            background: #1a1a1a;
            border-color: #2a2a2a;
            color: #fff;
          }
          .main-content { 
            flex: 1; 
            overflow-y: auto; 
            background: #000;
          }
        `}</style>
      </head>
      <body>
        <div className="app-container">
          <div className="sidebar">
            <div className="logo-section">
              <div className="logo-circle">S</div>
              <div className="logo-text">Spectre-HQ</div>
              <div className="logo-subtitle">Financial Dashboard</div>
            </div>
            <div className="nav-section">
              <button className="nav-item">
                <span className="nav-icon">🏠</span>
                <span>Home</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">📊</span>
                <span>Analytics</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">💰</span>
                <span>Cashflow</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">📦</span>
                <span>Orders</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">📈</span>
                <span>Stock</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">📁</span>
                <span>Products</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">🏷️</span>
                <span>Categories</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">🤖</span>
                <span>BI Assistant</span>
              </button>
              <button className="nav-item">
                <span className="nav-icon">✅</span>
                <span>Tasks</span>
              </button>
            </div>
            <div className="user-section">
              <div className="user-info">
                <div className="user-avatar">U</div>
                <div className="user-details">
                  <div className="user-name">User</div>
                  <div className="user-email">user@spectre.com</div>
                </div>
              </div>
              <button className="sign-out-btn">🚪 Sign out</button>
            </div>
          </div>
          <div className="main-content">{children}</div>
        </div>
      </body>
    </html>
  )
}
