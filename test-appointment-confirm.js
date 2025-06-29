const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure neon
const neonConfig = require('@neondatabase/serverless').neonConfig;
neonConfig.webSocketConstructor = ws;

async function testAppointmentConfirm() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Get a pending appointment
    const pendingResult = await pool.query(
      "SELECT * FROM appointments WHERE status = 'pending' LIMIT 1"
    );
    
    if (pendingResult.rows.length === 0) {
      console.log("No pending appointments found");
      return;
    }
    
    const appointment = pendingResult.rows[0];
    console.log("Found pending appointment:", {
      id: appointment.id,
      status: appointment.status,
      start_time: appointment.start_time
    });
    
    // Update status to confirmed
    const updateResult = await pool.query(
      "UPDATE appointments SET status = 'confirmed' WHERE id = $1 RETURNING *",
      [appointment.id]
    );
    
    if (updateResult.rows.length > 0) {
      console.log("Successfully confirmed appointment:", {
        id: updateResult.rows[0].id,
        status: updateResult.rows[0].status
      });
    } else {
      console.log("Failed to confirm appointment");
    }
    
  } catch (error) {
    console.error("Error testing appointment confirmation:", error);
  } finally {
    await pool.end();
  }
}

testAppointmentConfirm();