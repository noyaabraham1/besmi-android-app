const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function testCashPaymentFlow() {
  console.log('Testing cash payment flow...');
  
  try {
    // Create a test appointment that needs checkout
    const testAppointment = await db.execute(`
      INSERT INTO appointments (
        id, business_id, client_id, service_id, start_time, end_time, 
        status, price, notes, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), 
        'ea694a15-ffa2-4d5d-9302-77860a6ac085', 
        'a9c30456-81a6-4a95-a8b3-beef96bd3f8d', 
        'dea6a233-f361-4852-885d-029060353584', 
        NOW() - INTERVAL '3 hours', 
        NOW() - INTERVAL '1 hour', 
        'confirmed', 
        '80.00', 
        'Test appointment for cash payment', 
        NOW(), 
        NOW()
      ) RETURNING id, status
    `);
    
    const appointmentId = testAppointment.rows[0].id;
    console.log('Created test appointment:', appointmentId, 'with status:', testAppointment.rows[0].status);
    
    // Test cash payment API call
    const response = await fetch('http://localhost:5000/api/record-cash-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 80.00,
        subtotal: 80.00,
        tipAmount: 0,
        taxAmount: 0,
        items: [{ name: 'Classic Fill', price: 80.00, quantity: 1 }],
        clientId: 'a9c30456-81a6-4a95-a8b3-beef96bd3f8d',
        appointmentId: appointmentId,
        cashReceived: 100.00
      })
    });
    
    const result = await response.json();
    console.log('Cash payment API response:', result);
    
    // Check if appointment status was updated
    const updatedAppointment = await db.execute(`
      SELECT id, status, updated_at FROM appointments WHERE id = '${appointmentId}'
    `);
    
    console.log('Updated appointment status:', updatedAppointment.rows[0].status);
    console.log('Was appointment updated to completed?', updatedAppointment.rows[0].status === 'completed');
    
    // Cleanup
    await db.execute(`DELETE FROM appointments WHERE id = '${appointmentId}'`);
    console.log('Test appointment cleaned up');
    
  } catch (error) {
    console.error('Error testing cash payment flow:', error);
  }
}

testCashPaymentFlow();