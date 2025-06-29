import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestUser() {
  const hashedPassword = await hashPassword('demo123');
  console.log('Hashed password for demo123:', hashedPassword);
  
  // SQL to insert the user
  console.log(`
INSERT INTO users (email, password, first_name, last_name) 
VALUES ('demo@besmi.com', '${hashedPassword}', 'Demo', 'User');
  `);
}

createTestUser().catch(console.error);