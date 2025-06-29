/**
 * Twilio SMS Testing Script
 * Tests SMS functionality and diagnoses configuration issues
 */

import twilio from 'twilio';

async function testTwilioSMS() {
  console.log('=== TWILIO SMS DIAGNOSTIC TEST ===\n');
  
  // Check environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  console.log('1. CHECKING CONFIGURATION:');
  console.log('   Account SID present:', !!accountSid);
  console.log('   Auth Token present:', !!authToken);
  console.log('   Phone Number present:', !!fromNumber);
  console.log('   From Number:', fromNumber);
  
  if (!accountSid || !authToken || !fromNumber) {
    console.log('\n❌ MISSING CONFIGURATION - Check your environment variables');
    return;
  }
  
  // Initialize Twilio client
  const client = twilio(accountSid, authToken);
  
  try {
    console.log('\n2. TESTING TWILIO CONNECTION:');
    
    // Test account access
    const account = await client.api.accounts(accountSid).fetch();
    console.log('   ✅ Account connection successful');
    console.log('   Account Status:', account.status);
    console.log('   Account Type:', account.type);
    
    // Check phone number validity
    console.log('\n3. VALIDATING PHONE NUMBER:');
    const phoneNumbers = await client.incomingPhoneNumbers.list();
    const validNumber = phoneNumbers.find(num => num.phoneNumber === fromNumber);
    
    if (validNumber) {
      console.log('   ✅ Phone number is valid and active');
      console.log('   Capabilities:', validNumber.capabilities);
    } else {
      console.log('   ❌ Phone number not found in your Twilio account');
      console.log('   Available numbers:');
      phoneNumbers.forEach(num => {
        console.log('     -', num.phoneNumber);
      });
    }
    
    // Test SMS sending (you'll need to provide a test number)
    console.log('\n4. SMS SENDING TEST:');
    console.log('   To test SMS sending, we need a valid phone number to send to.');
    console.log('   Please provide your phone number in the format +1234567890');
    
    // Check account balance
    console.log('\n5. ACCOUNT BALANCE:');
    const balance = await client.balance.fetch();
    console.log('   Current Balance:', balance.balance, balance.currency);
    
    if (parseFloat(balance.balance) <= 0) {
      console.log('   ⚠️  WARNING: Low or zero balance - add funds to send SMS');
    }
    
  } catch (error) {
    console.log('\n❌ TWILIO CONNECTION FAILED:');
    console.log('   Error:', error.message);
    console.log('   Code:', error.code);
    
    if (error.code === 20003) {
      console.log('   🔧 FIX: Check your Account SID and Auth Token');
    } else if (error.code === 21608) {
      console.log('   🔧 FIX: Phone number not configured for SMS');
    }
  }
  
  console.log('\n=== DIAGNOSTIC COMPLETE ===');
}

// Function to test sending SMS to a specific number
async function testSendSMS(toNumber) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  const client = twilio(accountSid, authToken);
  
  try {
    console.log('\n=== SENDING TEST SMS ===');
    console.log('From:', fromNumber);
    console.log('To:', toNumber);
    
    const message = await client.messages.create({
      body: 'Test message from Besmi platform - SMS is working! 🎉',
      from: fromNumber,
      to: toNumber
    });
    
    console.log('✅ SMS SENT SUCCESSFULLY!');
    console.log('Message SID:', message.sid);
    console.log('Status:', message.status);
    
  } catch (error) {
    console.log('❌ SMS SENDING FAILED:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    
    // Common error codes and solutions
    switch (error.code) {
      case 21211:
        console.log('🔧 FIX: Invalid phone number format');
        break;
      case 21608:
        console.log('🔧 FIX: Phone number not capable of receiving SMS');
        break;
      case 21614:
        console.log('🔧 FIX: Phone number not verified (trial account)');
        break;
      case 20003:
        console.log('🔧 FIX: Authentication failed - check credentials');
        break;
      default:
        console.log('🔧 Check Twilio documentation for error code:', error.code);
    }
  }
}

// Run diagnostic
testTwilioSMS();

// Export for manual testing with phone number
export { testSendSMS };