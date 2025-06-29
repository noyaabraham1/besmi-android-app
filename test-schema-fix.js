// Test script to verify the duplicate custom_css column fix
const { execSync } = require('child_process');

async function testSchemaFix() {
  try {
    console.log('Testing business creation with fixed schema...');
    
    // Test if we can create a business without the duplicate column error
    const testSql = `
      INSERT INTO businesses (
        user_id, 
        business_name, 
        booking_page_slug,
        custom_css
      ) VALUES (
        'b8f25643-2355-4bb5-a3f9-84eadb943b40',
        'Test Schema Fix',
        'test-schema-fix-${Date.now()}',
        '.test { color: blue; }'
      ) RETURNING id;
    `;
    
    // Use tsx to execute SQL through our app
    const result = execSync(`npx tsx -e "
      import { db } from './server/db.js';
      import { sql } from 'drizzle-orm';
      
      async function test() {
        try {
          const result = await db.execute(sql\`${testSql.replace(/`/g, '\\`')}\`);
          console.log('SUCCESS: Business created with ID:', result.rows[0]?.id);
          
          // Clean up
          if (result.rows[0]?.id) {
            await db.execute(sql\`DELETE FROM businesses WHERE id = '\${result.rows[0].id}'\`);
            console.log('Test business cleaned up');
          }
        } catch (error) {
          console.error('FAILED:', error.message);
          process.exit(1);
        }
      }
      
      test();
    "`, { encoding: 'utf8', timeout: 10000 });
    
    console.log(result);
    console.log('\n✅ Schema fix successful - no duplicate column error!');
    
  } catch (error) {
    console.error('❌ Schema test failed:', error.message);
    if (error.message.includes('custom_css') && error.message.includes('more than once')) {
      console.error('The duplicate custom_css column issue still exists');
    }
    process.exit(1);
  }
}

testSchemaFix();