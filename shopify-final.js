// Shopify Proxy - Works with Vercel Node 18+

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }
  
  try {
    const { storeUrl, accessToken } = req.query;
    
    if (!storeUrl || !accessToken) {
      return res.status(400).json({ 
        error: 'Missing required params',
        need: 'storeUrl and accessToken'
      });
    }
    
    const url = `https://${storeUrl}/admin/api/2024-04/products.json?limit=250`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Shopify returned error',
        status: response.status,
        data: data
      });
    }
    
    return res.status(200).json(data);
    
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ 
      error: err.message 
    });
  }
}
