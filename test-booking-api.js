// Test script to verify booking API data flow
const fetch = require('node-fetch');

async function testBookingAPI() {
  try {
    console.log('Testing booking API data flow...');
    
    // First, get the business data to see what slug exists
    const businessResponse = await fetch('http://localhost:5000/api/business', {
      headers: {
        'Cookie': 'connect.sid=your-session-id' // This would need a real session
      }
    });
    
    if (businessResponse.status === 401) {
      console.log('Need to test with a business slug directly...');
      
      // Test with a common slug format
      const testSlugs = ['test-business', 'demo-lashes', 'beauty-studio'];
      
      for (const slug of testSlugs) {
        console.log(`\nTesting slug: ${slug}`);
        const bookingResponse = await fetch(`http://localhost:5000/api/booking/${slug}`);
        const result = await bookingResponse.json();
        
        if (bookingResponse.ok) {
          console.log('✅ Found business with slug:', slug);
          console.log('Business data keys:', Object.keys(result.business || {}));
          console.log('pageModules:', result.business?.pageModules);
          console.log('primaryBrandColor:', result.business?.primaryBrandColor);
          console.log('sectionOrder:', result.business?.sectionOrder);
          break;
        } else {
          console.log('❌ Slug not found:', slug, result.message);
        }
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBookingAPI();