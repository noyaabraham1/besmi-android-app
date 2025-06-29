// Debug script to check price formatting
const { storage } = require('./server/storage-fixed.js');

async function debugPrices() {
  try {
    console.log('Testing price data...');
    
    // Get services from database
    const services = await storage.getBusinessServices('2f4d2f94-a9e5-42fd-9383-4801aab2cc2c');
    
    console.log('Services from database:');
    services.forEach(service => {
      console.log(`- ${service.name}: price=${service.price} (type: ${typeof service.price})`);
    });
    
    // Test price formatting
    const testPrices = ['85.00', 85.00, '105', 105];
    console.log('\nPrice formatting tests:');
    testPrices.forEach(price => {
      console.log(`${price} -> $${price} (type: ${typeof price})`);
    });
    
  } catch (error) {
    console.error('Debug error:', error);
  }
  process.exit(0);
}

debugPrices();