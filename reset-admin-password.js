import bcrypt from 'bcrypt';
import { neon } from '@neondatabase/serverless';

async function resetAdminPassword() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    // Hash the new password
    const newPassword = '@Pujituhan22';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    console.log('Hashed password:', hashedPassword);
    
    // Update the user's password
    const result = await sql`
      UPDATE users 
      SET password = ${hashedPassword}, updated_at = NOW()
      WHERE email = 'admin@moualashco.com'
      RETURNING id, email, first_name, last_name
    `;
    
    if (result.length > 0) {
      console.log('Password reset successful for:', result[0]);
      console.log('User ID:', result[0].id);
      console.log('Email:', result[0].email);
      console.log('Name:', result[0].first_name, result[0].last_name);
      console.log('New password:', newPassword);
    } else {
      console.log('No user found with email admin@moualashco.com');
    }
    
  } catch (error) {
    console.error('Error resetting password:', error);
  }
}

resetAdminPassword();