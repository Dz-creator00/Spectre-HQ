// ============================================================================
// BOSTA DELIVERIES API - VERCEL SERVERLESS FUNCTION
// ============================================================================
// Secure server-side proxy that:
// - Keeps API key secret (never exposed to browser)
// - Handles both JSON and non-JSON responses
// - Proper error handling
// - CORS headers for frontend access
// ============================================================================

const BOSTA_BASE_URL = process.env.BOSTA_BASE_URL || 'https://app.bosta.co/api/v2';
const BOSTA_API_KEY = process.env.BOSTA_API_KEY;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    // Check if API key is configured
    if (!BOSTA_API_KEY) {
      console.error('❌ BOSTA_API_KEY environment variable is not set!');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Missing BOSTA_API_KEY',
        hint: 'Set BOSTA_API_KEY in Vercel environment variables'
      });
    }

    // Get query parameters from request
    const { page = '1', limit = '50', startDate, endDate, state } = req.query;

    // Build Bosta API URL with query parameters
    const url = new URL(`${BOSTA_BASE_URL}/deliveries`);
    url.searchParams.set('apiVersion', '1');
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    
    if (startDate) url.searchParams.set('startDate', startDate);
    if (endDate) url.searchParams.set('endDate', endDate);
    if (state) url.searchParams.set('state', state);

    console.log('🚀 Fetching from Bosta:', url.toString());

    // Call Bosta API
    const bostaResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': BOSTA_API_KEY,  // ✅ Correct: No "Bearer" prefix
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('📊 Bosta Response Status:', bostaResponse.status);

    // Get response as TEXT first (don't assume it's JSON!)
    const responseText = await bostaResponse.text();
    console.log('📄 Bosta Response (first 500 chars):', responseText.substring(0, 500));

    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Bosta response as JSON');
      console.error('Response was:', responseText.substring(0, 1000));
      
      return res.status(502).json({
        success: false,
        error: 'Bosta returned non-JSON response',
        bostaStatus: bostaResponse.status,
        responsePreview: responseText.substring(0, 500),
        hint: 'Bosta API might be returning HTML error page. Check if endpoint is correct.'
      });
    }

    // If Bosta returned an error status
    if (!bostaResponse.ok) {
      console.error('❌ Bosta API Error:', responseData);
      
      return res.status(bostaResponse.status).json({
        success: false,
        error: 'Bosta API returned an error',
        bostaStatus: bostaResponse.status,
        bostaError: responseData
      });
    }

    // Success! Return the data
    console.log('✅ Successfully fetched deliveries from Bosta');
    
    return res.status(200).json({
      success: true,
      data: responseData,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        fetchedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Fatal error in Bosta API handler:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
