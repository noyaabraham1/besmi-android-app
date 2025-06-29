// Test payment processing with 3.85% + $0.30 fee structure
console.log('Testing Payment Flow with Stripe Integration...\n');

const testPayments = [
  { amount: 50.00, service: "Classic Lash Set" },
  { amount: 100.00, service: "Volume Lash Set" },
  { amount: 150.00, service: "Mega Volume Set" }
];

async function testStripePayment(amount) {
  try {
    const response = await fetch('http://localhost:5000/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'connect.sid=your-session-id' // This would be from your login session
      },
      body: JSON.stringify({
        amount: amount,
        paymentMethodId: 'pm_card_visa', // Stripe test card
        businessId: '2f4d2f94-a9e5-42fd-9383-4801aab2cc2c',
        appointmentId: `test-${Date.now()}`,
        clientEmail: 'test@example.com'
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Payment test failed:', error);
    return null;
  }
}

// Calculate fees for demonstration
testPayments.forEach(payment => {
  const platformFeePercent = 3.85;
  const fixedFee = 0.30;
  const platformFee = Math.round((payment.amount * (platformFeePercent / 100) + fixedFee) * 100) / 100;
  const artistAmount = payment.amount - platformFee;
  const effectiveRate = ((platformFee / payment.amount) * 100);
  
  console.log(`${payment.service} - $${payment.amount.toFixed(2)}`);
  console.log(`  Platform Fee: $${platformFee.toFixed(2)} (${effectiveRate.toFixed(2)}%)`);
  console.log(`  Artist Receives: $${artistAmount.toFixed(2)}`);
  console.log('');
});

console.log('Fee Structure Summary:');
console.log('====================');
console.log('• Base rate: 3.85% of transaction amount');
console.log('• Fixed fee: $0.30 per transaction');
console.log('• Total fee = (amount × 3.85%) + $0.30');
console.log('• Automated payouts process every 24 hours');
console.log('• Artists receive net amount via direct bank transfer');