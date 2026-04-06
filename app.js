const supabase = window.supabase.createClient(
  'https://aoblmlzfigpdowxylvma.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvYmxtbHpmaWdwZG93eHlsdm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjEzMjksImV4cCI6MjA5MTAzNzMyOX0.5szGfdb3c-WwVXjulvcGplFVagtYSHIAi9h6jUN-lwg'
);

let currentBrand = null;
let currentPage = 'home';
let transactions = [];
let products = [];

const fmt = (n) => `EGP ${parseFloat(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

function render() {
  const app = document.getElementById('app');
  if (!currentBrand) {
    app.innerHTML = renderLogin();
  } else {
    app.innerHTML = `
      ${renderSidebar()}
      <div class="main">${renderPage()}</div>
    `;
  }
  attachEventListeners();
}

function renderLogin() {
  return `
    <div class="login-box">
      <div class="login-card">
        <h1 style="text-align: center; font-size: 32px; font-weight: 700;" class="mb-1">Spectre-HQ</h1>
        <p style="text-align: center; color: #888; font-size: 15px;" class="mb-4">☁️ Financial OS</p>
        <input type="text" id="brandName" placeholder="Brand Name" style="width: 100%;" class="mb-2">
        <input type="email" id="email" placeholder="Email" style="width: 100%;" class="mb-2">
        <input type="password" id="password" placeholder="Password" style="width: 100%;" class="mb-3">
        <button id="registerBtn" style="width: 100%;">Create Brand Account</button>
      </div>
    </div>
  `;
}

function renderSidebar() {
  const pages = ['Home', 'Cashflow', 'Products'];
  return `
    <div class="sidebar">
      <div class="mb-4">
        <div style="width: 40px; height: 40px; background: #B8B8B8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; color: #000;" class="mb-2">
          ${currentBrand.brand_name[0].toUpperCase()}
        </div>
        <div style="font-size: 15px; font-weight: 500;">${currentBrand.brand_name}</div>
        <div style="font-size: 13px; color: #888;">${currentBrand.email}</div>
      </div>
      <div style="flex: 1;">
        ${pages.map(p => `<button class="nav-btn ${currentPage === p.toLowerCase() ? 'active' : ''}" data-page="${p.toLowerCase()}">${p}</button>`).join('')}
      </div>
      <button id="logoutBtn" style="width: 100%; background: transparent; border: 1px solid #2a2a2a; color: #888;">Sign out</button>
    </div>
  `;
}

function renderPage() {
  if (currentPage === 'home') return renderHome();
  if (currentPage === 'cashflow') return renderCashflow();
  if (currentPage === 'products') return renderProducts();
  return '<p>Page not found</p>';
}

function renderHome() {
  const totalIn = transactions.filter(t => t.type === 'in').reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((s, t) => s + parseFloat(t.amount), 0);
  
  return `
    <h1 style="font-size: 32px; font-weight: 600;" class="mb-1">Dashboard</h1>
    <p style="color: #888; font-size: 15px;" class="mb-4">Overview of your financial activity</p>
    <div class="grid grid-2 mb-4">
      <div class="card">
        <div style="font-size: 12px; color: #888; text-transform: uppercase;" class="mb-1">Total In</div>
        <div class="stat green">${fmt(totalIn)}</div>
      </div>
      <div class="card">
        <div style="font-size: 12px; color: #888; text-transform: uppercase;" class="mb-1">Total Out</div>
        <div class="stat red">${fmt(totalOut)}</div>
      </div>
    </div>
    <p style="color: #888;">Navigate using the sidebar to manage cashflow and products.</p>
  `;
}

function renderCashflow() {
  const totalIn = transactions.filter(t => t.type === 'in').reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((s, t) => s + parseFloat(t.amount), 0);
  
  return `
    <h1 style="font-size: 32px; font-weight: 600;" class="mb-1">Cashflow</h1>
    <p style="color: #888; font-size: 15px;" class="mb-4">Track money in and out</p>
    
    <div class="card mb-4">
      <h3 class="mb-3">Add Transaction</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 2fr auto; gap: 12px;">
        <input type="date" id="txDate" value="${new Date().toISOString().split('T')[0]}">
        <select id="txType">
          <option value="in">Money In</option>
          <option value="out">Money Out</option>
        </select>
        <input type="number" id="txAmount" placeholder="Amount">
        <input type="text" id="txReason" placeholder="Reason">
        <button id="addTxBtn">Add</button>
      </div>
    </div>
    
    <div class="grid grid-3 mb-4">
      <div class="card">
        <div style="font-size: 12px; color: #888; text-transform: uppercase;" class="mb-1">Total In</div>
        <div class="stat green">${fmt(totalIn)}</div>
      </div>
      <div class="card">
        <div style="font-size: 12px; color: #888; text-transform: uppercase;" class="mb-1">Total Out</div>
        <div class="stat red">${fmt(totalOut)}</div>
      </div>
      <div class="card">
        <div style="font-size: 12px; color: #888; text-transform: uppercase;" class="mb-1">Net</div>
        <div class="stat green">${fmt(totalIn - totalOut)}</div>
      </div>
    </div>
    
    <div class="card">
      <h3 style="font-size: 14px; color: #888; text-transform: uppercase;" class="mb-3">All Transactions</h3>
      ${transactions.length === 0 ? '<p style="color: #666; text-align: center; padding: 40px;">No transactions yet</p>' : `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Reason</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(t => `
              <tr>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td style="color: ${t.type === 'in' ? '#10b981' : '#ef4444'}; font-weight: 500;">${t.type.toUpperCase()}</td>
                <td style="color: ${t.type === 'in' ? '#10b981' : '#ef4444'}; font-weight: 500;">${fmt(t.amount)}</td>
                <td>${t.reason}</td>
                <td style="text-align: right;"><button class="delete-tx" data-id="${t.id}" style="background: transparent; color: #888; padding: 4px 8px;">Delete</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function renderProducts() {
  return `
    <h1 style="font-size: 32px; font-weight: 600;" class="mb-1">Products</h1>
    <p style="color: #888; font-size: 15px;" class="mb-4">Manage your SKU list</p>
    
    <div class="card mb-4">
      <h3 class="mb-3">Add Product</h3>
      <div style="display: flex; gap: 12px;">
        <input type="text" id="pSku" placeholder="SKU (e.g. BO-2159519)" style="flex: 1;">
        <input type="text" id="pName" placeholder="Product Name" style="flex: 1;">
        <button id="addProductBtn">Add</button>
      </div>
    </div>
    
    <div class="card">
      <h3 style="font-size: 14px; color: #888; text-transform: uppercase;" class="mb-3">All Products (${products.length})</h3>
      ${products.length === 0 ? '<p style="color: #666; text-align: center; padding: 40px;">📦<br>No products yet</p>' : `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${products.map(p => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #0f0f0f; padding: 16px 20px; border-radius: 8px; border: 1px solid #2a2a2a;">
              <div style="display: flex; gap: 20px; align-items: center;">
                <div style="font-family: monospace; color: #888; font-size: 14px; background: #1a1a1a; padding: 4px 12px; border-radius: 6px;">${p.sku}</div>
                <div style="color: #fff; font-size: 15px;">${p.name}</div>
              </div>
              <button class="delete-product" data-id="${p.id}" style="background: transparent; color: #888; padding: 4px 8px;">Delete</button>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function attachEventListeners() {
  // Login
  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) registerBtn.onclick = handleRegister;
  
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.onclick = handleLogout;
  
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => {
      currentPage = btn.dataset.page;
      render();
    };
  });
  
  // Add transaction
  const addTxBtn = document.getElementById('addTxBtn');
  if (addTxBtn) addTxBtn.onclick = handleAddTransaction;
  
  // Delete transactions
  document.querySelectorAll('.delete-tx').forEach(btn => {
    btn.onclick = () => handleDeleteTransaction(btn.dataset.id);
  });
  
  // Add product
  const addProductBtn = document.getElementById('addProductBtn');
  if (addProductBtn) addProductBtn.onclick = handleAddProduct;
  
  // Delete products
  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.onclick = () => handleDeleteProduct(btn.dataset.id);
  });
}

async function handleRegister() {
  const brandName = document.getElementById('brandName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!brandName || !email || !password) {
    alert('Please fill all fields');
    return;
  }
  
  try {
    const { data: existing } = await supabase.from('brands').select('*').eq('email', email);
    if (existing && existing.length > 0) {
      alert('Email already registered');
      return;
    }
    
    const { data, error } = await supabase.from('brands').insert([{ brand_name: brandName, email }]).select();
    if (error) throw error;
    
    currentBrand = data[0];
    localStorage.setItem('spectre_brand', JSON.stringify(currentBrand));
    await loadData();
    render();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function handleLogout() {
  localStorage.removeItem('spectre_brand');
  currentBrand = null;
  transactions = [];
  products = [];
  currentPage = 'home';
  render();
}

async function handleAddTransaction() {
  const date = document.getElementById('txDate').value;
  const type = document.getElementById('txType').value;
  const amount = document.getElementById('txAmount').value;
  const reason = document.getElementById('txReason').value;
  
  if (!amount || !reason) {
    alert('Fill all fields');
    return;
  }
  
  try {
    const { data, error } = await supabase.from('transactions').insert([{ 
      brand_id: currentBrand.id, 
      date, 
      type, 
      amount, 
      reason 
    }]).select();
    if (error) throw error;
    
    transactions.push(data[0]);
    render();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function handleDeleteTransaction(id) {
  try {
    await supabase.from('transactions').delete().eq('id', id);
    transactions = transactions.filter(t => t.id !== id);
    render();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function handleAddProduct() {
  const sku = document.getElementById('pSku').value;
  const name = document.getElementById('pName').value;
  
  if (!sku || !name) {
    alert('Fill all fields');
    return;
  }
  
  try {
    const { data, error } = await supabase.from('products').insert([{ 
      brand_id: currentBrand.id, 
      sku, 
      name 
    }]).select();
    if (error) throw error;
    
    products.push(data[0]);
    render();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function handleDeleteProduct(id) {
  try {
    await supabase.from('products').delete().eq('id', id);
    products = products.filter(p => p.id !== id);
    render();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function loadData() {
  if (!currentBrand) return;
  
  const [txRes, prodRes] = await Promise.all([
    supabase.from('transactions').select('*').eq('brand_id', currentBrand.id),
    supabase.from('products').select('*').eq('brand_id', currentBrand.id)
  ]);
  
  if (txRes.data) transactions = txRes.data;
  if (prodRes.data) products = prodRes.data;
}

// Initialize
(async () => {
  const saved = localStorage.getItem('spectre_brand');
  if (saved) {
    currentBrand = JSON.parse(saved);
    await loadData();
  }
  render();
})();
