// Bosta API Proxy - Fetch Deliveries & COD Data
// Production API: https://app.bosta.co/api/v2

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
  
  const { apiKey, endpoint, from, to } = req.query;
  
  if (!apiKey) {
    return res.status(400).json({ 
      error: 'Missing API key',
      message: 'apiKey is required'
    });
  }
  
  // Clean API key - check if it already has Bearer
  const cleanApiKey = apiKey.trim();
  const authHeader = cleanApiKey.toLowerCase().startsWith('bearer ') 
    ? cleanApiKey 
    : `Bearer ${cleanApiKey}`;
  
  // Determine API path based on endpoint type
  let path;
  
  switch(endpoint) {
    case 'deliveries':
      // Get all deliveries with optional date filter
      path = '/api/v2/deliveries';
      if (from && to) {
        path += `?from=${from}&to=${to}`;
      }
      break;
      
    case 'delivery':
      // Get single delivery by tracking number
      const trackingNumber = req.query.trackingNumber;
      if (!trackingNumber) {
        return res.status(400).json({ error: 'trackingNumber required for delivery endpoint' });
      }
      path = `/api/v2/deliveries/${trackingNumber}`;
      break;
      
    case 'settlements':
      // Get settlement/payout information
      path = '/api/v2/settlements';
      if (from && to) {
        path += `?from=${from}&to=${to}`;
      }
      break;
      
    default:
      return res.status(400).json({ 
        error: 'Invalid endpoint',
        message: 'Valid endpoints: deliveries, delivery, settlements'
      });
  }
  
  // Call Bosta API
  const options = {
    hostname: 'app.bosta.co',
    path: path,
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
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
          // Return both the parse error and the actual response
          res.status(500).json({ 
            error: 'Invalid JSON response from Bosta', 
            message: e.message,
            statusCode: apiRes.statusCode,
            response: data.substring(0, 500), // First 500 chars of response
            hint: 'Check if your Bosta API key is correct and has proper permissions'
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
