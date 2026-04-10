// ============================================================================
// BOSTA ANALYTICS API - Get Aggregate Delivery Counts
// ============================================================================
// NOTE: Bosta does NOT have an endpoint to list all deliveries!
// This endpoint only returns COUNTS, not individual delivery details
// ============================================================================

const BOSTA_BASE_URL = process.env.BOSTA_BASE_URL || 'https://app.bosta.co/api/v2';
const BOSTA_API_KEY = process.env.BOSTA_API_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!BOSTA_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Missing BOSTA_API_KEY'
    });
  }

  try {
    console.log('📊 Fetching Bosta analytics...');

    const url = `${BOSTA_BASE_URL}/deliveries/analytics/total-deliveries`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': BOSTA_API_KEY,
        'Accept': 'application/json'
      }
    });

    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(502).json({
        success: false,
        error: 'Bosta returned non-JSON',
        responsePreview: text.substring(0, 500)
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'Bosta API error',
        bostaError: data
      });
    }

    // Return aggregate counts
    return res.status(200).json({
      success: true,
      analytics: data.data,
      note: 'These are aggregate counts only. Bosta API does not provide individual delivery details via API. Use manual Excel export for detailed data.'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
