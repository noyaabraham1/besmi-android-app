// Fix business name sync issue
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure for serverless
neonConfig.webSocketConstructor = ws;

async function fixBusinessNameSync() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Checking business records...');
    
    // Get all business records
    const result = await pool.query('SELECT id, business_name, booking_page_slug, user_id FROM businesses ORDER BY updated_at DESC');
    
    console.log('Found businesses:');
    result.rows.forEach((business, index) => {
      console.log(`${index + 1}. ID: ${business.id}`);
      console.log(`   Business Name: ${business.business_name}`);
      console.log(`   Booking Slug: ${business.booking_page_slug}`);
      console.log(`   User ID: ${business.user_id}`);
      console.log('');
    });
    
    // Check which business has the 'besmi' slug
    const besmiBusinessResult = await pool.query('SELECT * FROM businesses WHERE booking_page_slug = $1', ['besmi']);
    
    if (besmiBusinessResult.rows.length > 0) {
      const business = besmiBusinessResult.rows[0];
      console.log('Business with "besmi" slug:');
      console.log(`Business Name: ${business.business_name}`);
      console.log(`Should be updated to proper business name`);
      
      // Update the business name to a proper value
      const updateResult = await pool.query(
        'UPDATE businesses SET business_name = $1, updated_at = NOW() WHERE booking_page_slug = $2 RETURNING business_name',
        ['Mouaiash & Co', 'besmi']
      );
      
      console.log('Updated business name to:', updateResult.rows[0].business_name);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

fixBusinessNameSync();