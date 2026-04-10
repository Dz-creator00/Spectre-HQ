// Bosta API Proxy - DIAGNOSTIC VERSION
// Shows detailed error info

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
  
  // Clean API key
  const cleanApiKey = apiKey.trim();
  const authHeader = cleanApiKey.toLowerCase().startsWith('bearer ') 
    ? cleanApiKey 
    : `Bearer ${cleanApiKey}`;
  
  // Determine API path
  let path;
  
  switch(endpoint) {
    case 'deliveries':
      // Try without date filters first - some APIs don't support them
      path = '/api/v2/deliveries';
      // Note: Date filtering commented out to test if endpoint works at all
      // if (from && to) {
      //   const fromDate = new Date(from);
      //   fromDate.setHours(0, 0, 0, 0);
      //   const toDate = new Date(to);
      //   toDate.setHours(23, 59, 59, 999);
      //   path += `?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`;
      // }
      break;
      
    case 'delivery':
      const trackingNumber = req.query.trackingNumber;
      if (!trackingNumber) {
        return res.status(400).json({ error: 'trackingNumber required' });
      }
      path = `/api/v2/deliveries/${trackingNumber}`;
      break;
      
    case 'settlements':
      path = '/api/v2/settlements';
      if (from && to) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        
        path += `?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`;
      }
      break;
      
    default:
      return res.status(400).json({ 
        error: 'Invalid endpoint',
        message: 'Valid endpoints: deliveries, delivery, settlements'
      });
  }
  
  // DIAGNOSTIC INFO
  console.log('=== BOSTA API CALL ===');
  console.log('Host:', 'bosta.co');
  console.log('Path:', path);
  console.log('Auth Header:', authHeader.substring(0, 20) + '...');
  console.log('=====================');
  
  const options = {
    hostname: 'bosta.co',
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
        console.log('Response Status:', apiRes.statusCode);
        console.log('Response Headers:', apiRes.headers);
        console.log('Response Body (first 200 chars):', data.substring(0, 200));
        
        // Check if HTML (error page)
        if (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html')) {
          return res.status(500).json({ 
            error: 'Bosta returned HTML instead of JSON',
            statusCode: apiRes.statusCode,
            possibleReasons: [
              'API endpoint URL is wrong',
              'API key is invalid or expired',
              'API key does not have permission for deliveries endpoint',
              'Bosta API structure has changed'
            ],
            whatBostaReturned: data.substring(0, 1000),
            requestDetails: {
              url: `https://bosta.co${path}`,
              method: 'GET',
              authUsed: authHeader.substring(0, 25) + '...'
            }
          });
        }
        
        try {
          const parsed = JSON.parse(data);
          res.status(apiRes.statusCode).json(parsed);
          resolve();
        } catch (e) {
          res.status(500).json({ 
            error: 'Invalid JSON response',
            parseError: e.message,
            statusCode: apiRes.statusCode,
            responseHeaders: apiRes.headers,
            responseBody: data.substring(0, 1000)
          });
          resolve();
        }
      });
    });
    
    apiReq.on('error', (e) => {
      console.error('Request error:', e);
      res.status(500).json({ 
        error: 'Request failed', 
        message: e.message,
        code: e.code
      });
      resolve();
    });
    
    apiReq.end();
  });
};
