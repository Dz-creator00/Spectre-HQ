// Vercel Serverless Function - Shopify API Proxy
// This bypasses CORS by making the API call server-side

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get credentials from query params
    const { storeUrl, accessToken } = req.query;
    
    if (!storeUrl || !accessToken) {
      return res.status(400).json({ 
        error: 'Missing parameters',
        message: 'Required: storeUrl and accessToken'
      });
    }
    
    // Call Shopify API
    const shopifyUrl = `https://${storeUrl}/admin/api/2024-04/products.json?limit=250`;
    
    const response = await fetch(shopifyUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: 'Shopify API error',
        status: response.status,
        message: errorText
      });
    }
    
    const data = await response.json();
    
    // Return products
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
}
