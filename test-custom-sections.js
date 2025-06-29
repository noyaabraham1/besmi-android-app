// Test script to verify custom sections are being saved and loaded correctly
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import fetch from 'node-fetch';

// Configure neon
const neonConfig = { webSocketConstructor: ws };

async function testCustomSections() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Testing custom sections functionality...');
    
    // Get the current business
    const businessResult = await pool.query(
      "SELECT id, business_name, custom_sections, page_modules FROM businesses WHERE booking_page_slug = 'bellas-lash-studio'"
    );
    
    if (businessResult.rows.length === 0) {
      console.log('No business found with slug bellas-lash-studio');
      return;
    }
    
    const business = businessResult.rows[0];
    console.log('Current business:', business.business_name);
    console.log('Current custom_sections:', business.custom_sections);
    console.log('Current page_modules:', business.page_modules);
    
    // Add a test custom section
    const testSection = {
      id: `custom-${Date.now()}`,
      type: 'heading',
      content: 'Test Heading from Database',
      level: 2,
      alignment: 'center',
      bold: true,
      italic: false,
      fontSize: 'large',
      color: null
    };
    
    const newCustomSections = [testSection];
    
    console.log('\nAdding test custom section:', testSection);
    
    // Update the business with the new custom section
    const updateResult = await pool.query(
      "UPDATE businesses SET custom_sections = $1, updated_at = NOW() WHERE id = $2 RETURNING custom_sections",
      [JSON.stringify(newCustomSections), business.id]
    );
    
    console.log('Update result:', updateResult.rows[0]);
    
    // Verify the update by querying again
    const verifyResult = await pool.query(
      "SELECT custom_sections FROM businesses WHERE id = $1",
      [business.id]
    );
    
    console.log('Verified custom_sections after update:', verifyResult.rows[0].custom_sections);
    
    // Test the booking API endpoint to see if it returns the new data
    console.log('\nTesting booking API...');
    
    const bookingResponse = await fetch('http://localhost:5000/api/booking/bellas-lash-studio');
    const bookingData = await bookingResponse.json();
    
    console.log('Booking API customSections:', bookingData.business?.customSections);
    console.log('Booking API pageModules:', bookingData.business?.pageModules);
    
    if (bookingData.business?.customSections && bookingData.business.customSections.length > 0) {
      console.log('✅ SUCCESS: Custom sections are now appearing in booking API');
    } else {
      console.log('❌ ISSUE: Custom sections still not appearing in booking API');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await pool.end();
  }
}

testCustomSections();