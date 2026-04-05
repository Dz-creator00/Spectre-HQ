export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #000; color: #fff; }
          .container { display: flex; height: 100vh; }
          .sidebar { width: 260px; background: #1a1a1a; border-right: 1px solid #333; display: flex; flex-direction: column; }
          .logo { padding: 24px; border-bottom: 1px solid #333; }
          .logo-circle { width: 40px; height: 40px; background: #fff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #000; font-weight: bold; margin-right: 12px; }
          .nav { flex: 1; padding: 16px; overflow-y: auto; }
          .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin: 4px 0; border-radius: 8px; color: #ccc; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-size: 14px; }
          .nav-item:hover { background: #2a2a2a; }
          .user-section { padding: 16px; border-top: 1px solid #333; }
          .user-info { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
          .user-avatar { width: 40px; height: 40px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold; }
          .content { flex: 1; overflow-y: auto; padding: 32px; }
          .header { margin-bottom: 32px; }
          .header h1 { font-size: 28px; margin-bottom: 8px; }
          .header p { color: #888; }
          .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px; }
          .card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; border-top: 4px solid #fff; }
          .card-label { color: #888; font-size: 12px; margin-bottom: 8px; }
          .card-value { font-size: 28px; font-weight: bold; }
          .stats { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; }
          .stats h2 { font-size: 18px; margin-bottom: 16px; }
          .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .stat-item { }
          .stat-label { color: #888; font-size: 13px; margin-bottom: 4px; }
          .stat-value { font-size: 20px; font-weight: bold; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="sidebar">
            <div className="logo">
              <span className="logo-circle">S</span>
              <span style={{fontWeight: 'bold'}}>Spectre-HQ</span>
            </div>
            <div className="nav">
              <button className="nav-item">🏠 Home</button>
              <button className="nav-item">📊 Analytics</button>
              <button className="nav-item">💰 Cashflow</button>
              <button className="nav-item">📦 Orders</button>
              <button className="nav-item">📈 Stock</button>
              <button className="nav-item">📁 Products</button>
              <button className="nav-item">🏷️ Categories</button>
              <button className="nav-item">🤖 BI Assistant</button>
              <button className="nav-item">✅ Tasks</button>
            </div>
            <div className="user-section">
              <div className="user-info">
                <div className="user-avatar">U</div>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px'}}>User</div>
                  <div style={{fontSize: '12px', color: '#888'}}>user@spectre.com</div>
                </div>
              </div>
              <button className="nav-item">🚪 Sign out</button>
            </div>
          </div>
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  )
}
