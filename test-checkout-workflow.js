const { neon } = require('@neondatabase/serverless');

async function testCheckoutWorkflow() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log("Testing checkout workflow...");
    
    // 1. Find a confirmed appointment for testing
    const appointments = await sql`
      SELECT a.*, s.name as service_name, s.price as service_price, 
             c.first_name, c.last_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id  
      JOIN clients c ON a.client_id = c.id
      WHERE a.status = 'confirmed'
      ORDER BY a.start_time DESC
      LIMIT 5
    `;
    
    console.log(`Found ${appointments.length} confirmed appointments`);
    appointments.forEach(apt => {
      console.log(`- ${apt.first_name} ${apt.last_name}: ${apt.service_name} (${apt.status}) - $${apt.service_price}`);
    });
    
    if (appointments.length === 0) {
      console.log("No confirmed appointments found for testing");
      return;
    }
    
    // 2. Check completed appointments
    const completedAppointments = await sql`
      SELECT a.*, s.name as service_name, s.price as service_price,
             c.first_name, c.last_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN clients c ON a.client_id = c.id  
      WHERE a.status = 'completed'
      ORDER BY a.start_time DESC
      LIMIT 5
    `;
    
    console.log(`\nFound ${completedAppointments.length} completed appointments`);
    completedAppointments.forEach(apt => {
      console.log(`- ${apt.first_name} ${apt.last_name}: ${apt.service_name} (${apt.status}) - $${apt.service_price}`);
    });
    
    // 3. Test the filtering logic
    console.log("\n=== Testing Checkout Filtering Logic ===");
    const allAppointments = await sql`
      SELECT * FROM appointments 
      WHERE status IN ('confirmed', 'completed', 'cancelled', 'pending')
      ORDER BY status, start_time DESC
    `;
    
    const statusCounts = allAppointments.reduce((counts, apt) => {
      counts[apt.status] = (counts[apt.status] || 0) + 1;
      return counts;
    }, {});
    
    console.log("Appointment status breakdown:");
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`- ${status}: ${count} appointments`);
    });
    
    // 4. Apply the same filtering logic as the frontend
    const now = new Date();
    const checkoutReady = allAppointments.filter(apt => {
      // Only confirmed appointments need checkout - exclude completed, cancelled, etc.
      if (apt.status !== 'confirmed') return false;
      
      // Additional check: appointment should be past its end time to need checkout
      const appointmentEnd = new Date(apt.end_time);
      const oneHourAfterEnd = new Date(appointmentEnd.getTime() + (60 * 60 * 1000));
      return now > oneHourAfterEnd;
    });
    
    console.log(`\nFiltered result: ${checkoutReady.length} appointments need checkout`);
    console.log("These appointments should appear in POS and Dashboard checkout lists");
    
  } catch (error) {
    console.error("Error testing checkout workflow:", error);
  }
}

testCheckoutWorkflow();