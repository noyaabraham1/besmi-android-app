// Sync business records to fix Designer <-> Live page disconnect
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function syncBusinessRecords() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Syncing business records...');
    
    // Get the current user's session business (from Designer)
    const designerBusiness = await pool.query(
      'SELECT * FROM businesses WHERE id = $1', 
      ['ea694a15-ffa2-4d5d-9302-77860a6ac085']
    );
    
    // Get the live booking page business
    const liveBusiness = await pool.query(
      'SELECT * FROM businesses WHERE booking_page_slug = $1', 
      ['besmi']
    );
    
    if (designerBusiness.rows.length > 0 && liveBusiness.rows.length > 0) {
      const designer = designerBusiness.rows[0];
      const live = liveBusiness.rows[0];
      
      console.log('Designer Business:', designer.business_name, '- Slug:', designer.booking_page_slug);
      console.log('Live Business:', live.business_name, '- Slug:', live.booking_page_slug);
      
      // Update the live business with Designer data
      const updateResult = await pool.query(`
        UPDATE businesses SET 
          business_name = $1,
          description = $2,
          about_text = $3,
          specialties = $4,
          social_instagram = $5,
          social_facebook = $6,
          social_tiktok = $7,
          tagline = $8,
          primary_brand_color = $9,
          secondary_brand_color = $10,
          page_background_color = $11,
          updated_at = NOW()
        WHERE booking_page_slug = 'besmi'
        RETURNING business_name
      `, [
        designer.business_name,
        designer.description,
        designer.about_text,
        designer.specialties,
        designer.social_instagram,
        designer.social_facebook,
        designer.social_tiktok,
        designer.tagline,
        designer.primary_brand_color,
        designer.secondary_brand_color,
        designer.page_background_color
      ]);
      
      console.log('Successfully synced business data');
      console.log('Live booking page now shows:', updateResult.rows[0].business_name);
    }
    
  } catch (error) {
    console.error('Error syncing business records:', error);
  } finally {
    await pool.end();
  }
}

syncBusinessRecords();