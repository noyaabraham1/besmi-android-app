const { db } = require('./server/db.ts');
const { businesses } = require('./shared/schema.ts');
const { eq } = require('drizzle-orm');

async function addSocialMediaModule() {
  try {
    // Get the current business (bellas-lash-studio)
    const [business] = await db.select().from(businesses).where(eq(businesses.bookingPageSlug, 'bellas-lash-studio'));
    
    if (!business) {
      console.log('Business not found');
      return;
    }
    
    console.log('Current business:', business.businessName);
    console.log('Current pageModules:', business.pageModules);
    
    // Create a social media module
    const socialMediaModule = {
      id: 'social-media-' + Date.now(),
      type: 'socialMedia',
      order: 1,
      hidden: false,
      alignment: 'center',
      showLabels: true,
      size: 'medium'
    };
    
    // Update the business with the new pageModule
    const [updatedBusiness] = await db.update(businesses)
      .set({
        pageModules: JSON.stringify([socialMediaModule])
      })
      .where(eq(businesses.id, business.id))
      .returning();
    
    console.log('Added social media module successfully');
    console.log('New pageModules:', updatedBusiness.pageModules);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

addSocialMediaModule();