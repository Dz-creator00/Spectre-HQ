// ============================================================================
// BOSTA API PROXY - PRODUCTION VERSION
// ============================================================================
// Based on official Bosta documentation from docs.bosta.co
// Confirmed Base URL: https://app.bosta.co/api/v2
// Confirmed Auth: Authorization: <API_KEY> (no "Bearer" prefix)
// Confirmed Versioning: ?apiVersion=1 query parameter
// ============================================================================

const BOSTA_CONFIG = {
  baseUrl: 'https://app.bosta.co/api/v2',
  apiKey: '61625326d649991817a4faa1cf1e5b2fe93bfee71b2e3f46f7cf9bb5ed6f5e80',
  apiVersion: '1'
};

// ============================================================================
// FETCH DELIVERIES (List all deliveries)
// ============================================================================
// Note: This endpoint is NOT officially documented on bosta.co
// Using standard REST convention: GET /deliveries?apiVersion=1
// ============================================================================

export async function fetchDeliveries(filters = {}) {
  try {
    console.log('🚀 Fetching Bosta deliveries...');
    
    // Build URL with query parameters
    const url = new URL(`${BOSTA_CONFIG.baseUrl}/deliveries`);
    url.searchParams.set('apiVersion', BOSTA_CONFIG.apiVersion);
    
    // Add optional filters
    if (filters.page) url.searchParams.set('page', filters.page);
    if (filters.limit) url.searchParams.set('limit', filters.limit);
    if (filters.startDate) url.searchParams.set('startDate', filters.startDate);
    if (filters.endDate) url.searchParams.set('endDate', filters.endDate);
    if (filters.state) url.searchParams.set('state', filters.state);
    
    console.log('📡 Request URL:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': BOSTA_CONFIG.apiKey,  // ✅ Correct: No "Bearer" prefix
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Response Status:', response.status, response.statusText);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));

    // Get response body
    const contentType = response.headers.get('content-type');
    const responseText = await response.text();
    
    console.log('📄 Response Content-Type:', contentType);
    console.log('📦 Response Body (first 500 chars):', responseText.substring(0, 500));

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e.message);
      return {
        success: false,
        error: 'Response is not valid JSON',
        status: response.status,
        body: responseText
      };
    }

    // Check if request was successful
    if (!response.ok) {
      console.error('❌ API Error:', data);
      return {
        success: false,
        error: data.message || data.error || 'Unknown error',
        status: response.status,
        data: data
      };
    }

    // Success!
    console.log('✅ Successfully fetched deliveries!');
    console.log('📊 Data structure:', Object.keys(data));
    
    return {
      success: true,
      status: response.status,
      data: data,
      deliveries: data.deliveries || data.data || data.list || [], // Handle different response formats
      count: data.count || data.total || 0,
      page: data.page || 1
    };

  } catch (error) {
    console.error('💥 Fatal Error:', error);
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
}

// ============================================================================
// FETCH DELIVERY BY TRACKING NUMBER
// ============================================================================
// Using standard REST convention: GET /deliveries/:trackingNumber
// ============================================================================

export async function fetchDeliveryByTracking(trackingNumber) {
  try {
    console.log(`🔍 Fetching delivery: ${trackingNumber}`);
    
    const url = `${BOSTA_CONFIG.baseUrl}/deliveries/${trackingNumber}?apiVersion=${BOSTA_CONFIG.apiVersion}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': BOSTA_CONFIG.apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch delivery',
        status: response.status
      };
    }

    return {
      success: true,
      status: response.status,
      data: data
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================================
// ALTERNATIVE ENDPOINT TESTS
// ============================================================================
// In case the main endpoint doesn't work, test these alternatives
// ============================================================================

export async function testAlternativeEndpoints() {
  const alternatives = [
    '/deliveries',
    '/deliveries/list',
    '/business/deliveries',
    '/deliveries/all',
    '/v2/deliveries',  // In case v2 is part of the path, not base
  ];

  console.log('🧪 Testing alternative endpoints...\n');

  for (const path of alternatives) {
    const url = `${BOSTA_CONFIG.baseUrl}${path}?apiVersion=${BOSTA_CONFIG.apiVersion}`;
    
    try {
      console.log(`Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': BOSTA_CONFIG.apiKey,
          'Accept': 'application/json'
        }
      });

      console.log(`  Status: ${response.status}`);
      
      const text = await response.text();
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = JSON.parse(text);
        console.log(`  ✅ Valid JSON response!`);
        console.log(`  Preview:`, JSON.stringify(data).substring(0, 200));
        
        if (response.status === 200) {
          console.log(`\n  🎉 SUCCESS! Working endpoint found: ${path}\n`);
          return { success: true, endpoint: path, data };
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }

  console.log('❌ No working alternative endpoint found\n');
  return { success: false };
}

// ============================================================================
// DIAGNOSTIC FUNCTION
// ============================================================================

export async function diagnosticTest() {
  console.log('🔍 BOSTA API DIAGNOSTIC TEST');
  console.log('═'.repeat(80));
  console.log('\n📋 Configuration:');
  console.log('  Base URL:', BOSTA_CONFIG.baseUrl);
  console.log('  API Key:', BOSTA_CONFIG.apiKey.substring(0, 20) + '...');
  console.log('  API Version:', BOSTA_CONFIG.apiVersion);
  console.log('\n' + '─'.repeat(80) + '\n');

  // Test 1: Main endpoint
  console.log('TEST 1: Main deliveries endpoint');
  console.log('─'.repeat(80));
  const result1 = await fetchDeliveries({ limit: 10 });
  console.log('\nResult:', JSON.stringify(result1, null, 2));
  console.log('\n' + '─'.repeat(80) + '\n');

  // Test 2: Alternative endpoints
  if (!result1.success) {
    console.log('TEST 2: Alternative endpoints');
    console.log('─'.repeat(80));
    const result2 = await testAlternativeEndpoints();
    console.log('\n' + '─'.repeat(80) + '\n');
  }

  console.log('═'.repeat(80));
  console.log('🏁 Diagnostic test complete!\n');
}

// ============================================================================
// AUTO-RUN DIAGNOSTIC IF EXECUTED DIRECTLY
// ============================================================================

if (typeof window === 'undefined') {
  // Running in Node.js
  diagnosticTest().catch(console.error);
}
