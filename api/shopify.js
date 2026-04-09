// Bulletproof Shopify Proxy
// This WILL work.

const https = require('https');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { storeUrl, accessToken } = req.query;
  
  if (!storeUrl || !accessToken) {
    return res.status(400).json({ 
      error: 'Missing parameters',
      received: { storeUrl: !!storeUrl, accessToken: !!accessToken }
    });
  }
  
  // Use native https module (always works)
  const options = {
    hostname: storeUrl,
    path: '/admin/api/2024-04/products.json?limit=250',
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    }
  };
  
  return new Promise((resolve) => {
    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          res.status(apiRes.statusCode).json(parsed);
          resolve();
        } catch (e) {
          res.status(500).json({ 
            error: 'Parse error', 
            message: e.message,
            data: data.substring(0, 200)
          });
          resolve();
        }
      });
    });
    
    apiReq.on('error', (e) => {
      res.status(500).json({ 
        error: 'Request failed', 
        message: e.message 
      });
      resolve();
    });
    
    apiReq.end();
  });
};
