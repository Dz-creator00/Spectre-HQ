// ============================================================================
// BOSTA DELIVERIES API - WORKING VERSION
// Using the correct POST /deliveries/search endpoint
// ============================================================================

const BOSTA_BASE_URL = process.env.BOSTA_BASE_URL || 'https://app.bosta.co/api/v2';
const BOSTA_API_KEY = process.env.BOSTA_API_KEY;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!BOSTA_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Missing BOSTA_API_KEY environment variable'
      });
    }

    console.log('🚀 Fetching from Bosta using POST /deliveries/search');

    // Build search body with optional filters
    const searchBody = {};
    
    // Add filters from query params if provided
    if (req.query.type) searchBody.type = req.query.type;
    if (req.query.trackingNumbers) searchBody.trackingNumbers = req.query.trackingNumbers.split(',');
    if (req.query.businessReference) searchBody.businessReference = req.query.businessReference;
    if (req.query.stateCodes) searchBody.stateCodes = req.query.stateCodes.split(',');

    console.log('Search body:', searchBody);

    // ✅ CORRECT ENDPOINT: POST /deliveries/search
    const url = `${BOSTA_BASE_URL}/deliveries/search`;
    
    const bostaResponse = await fetch(url, {
      method: 'POST',  // ✅ POST, not GET!
      headers: {
        'Authorization': BOSTA_API_KEY,  // ✅ No Bearer prefix
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(searchBody)  // Empty body = return all deliveries
    });

    console.log('📊 Bosta Response Status:', bostaResponse.status);

    // Get response as text first
    const responseText = await bostaResponse.text();
    console.log('📄 Response (first 500 chars):', responseText.substring(0, 500));

    // Parse JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON');
      return res.status(502).json({
        success: false,
        error: 'Bosta returned non-JSON response',
        bostaStatus: bostaResponse.status,
        responsePreview: responseText.substring(0, 500)
      });
    }

    // Check if request was successful
    if (!bostaResponse.ok) {
      console.error('❌ Bosta API Error:', responseData);
      return res.status(bostaResponse.status).json({
        success: false,
        error: 'Bosta API returned an error',
        bostaStatus: bostaResponse.status,
        bostaError: responseData
      });
    }

    // Success!
    console.log('✅ Successfully fetched deliveries from Bosta');
    console.log('Response structure:', {
      hasData: !!responseData.data,
      dataType: Array.isArray(responseData.data) ? 'array' : typeof responseData.data,
      dataKeys: responseData.data ? Object.keys(responseData.data).slice(0, 10) : [],
      sampleData: responseData.data
    });
    
    // Bosta returns: { success: true, message: "...", data: {...} }
    return res.status(200).json({
      success: true,
      data: responseData.data || responseData,
      bostaResponse: responseData,
      meta: {
        fetchedAt: new Date().toISOString(),
        filters: searchBody
      }
    });

  } catch (error) {
    console.error('💥 Fatal error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
