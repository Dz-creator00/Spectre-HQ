// Vercel Serverless Function - Shopify API Proxy (Fixed)
// Better error handling and uses node-fetch

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }
  
  // Only allow GET
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers }
    );
  }
  
  try {
    // Get credentials from query params
    const url = new URL(req.url);
    const storeUrl = url.searchParams.get('storeUrl');
    const accessToken = url.searchParams.get('accessToken');
    
    if (!storeUrl || !accessToken) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing parameters',
          message: 'Required: storeUrl and accessToken',
          example: '/api/shopify?storeUrl=store.myshopify.com&accessToken=shpat_xxx'
        }), 
        { status: 400, headers }
      );
    }
    
    // Call Shopify API
    const shopifyUrl = `https://${storeUrl}/admin/api/2024-04/products.json?limit=250`;
    
    console.log('Calling Shopify:', shopifyUrl);
    
    const response = await fetch(shopifyUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Shopify response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify error:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Shopify API error',
          status: response.status,
          message: errorText,
          storeUrl: storeUrl
        }), 
        { status: response.status, headers }
      );
    }
    
    const data = await response.json();
    
    console.log('Products fetched:', data.products?.length || 0);
    
    // Return products
    return new Response(
      JSON.stringify(data), 
      { status: 200, headers }
    );
    
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Server error',
        message: error.message,
        stack: error.stack
      }), 
      { status: 500, headers }
    );
  }
}
