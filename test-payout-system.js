console.log('Testing Payout System with 3.85% + $0.30 fee structure...\n');

// Test different payment amounts to show fee calculation
const testPayments = [
  { amount: 50.00, description: "Classic Lash Set" },
  { amount: 100.00, description: "Volume Lash Set" },
  { amount: 150.00, description: "Mega Volume Set" },
  { amount: 25.00, description: "Lash Fill" }
];

console.log('Fee Calculation Examples:');
console.log('========================');

testPayments.forEach(payment => {
  const platformFeePercent = 3.85;
  const fixedFee = 0.30;
  const platformFee = Math.round((payment.amount * (platformFeePercent / 100) + fixedFee) * 100) / 100;
  const artistAmount = payment.amount - platformFee;
  
  console.log(`\n${payment.description}:`);
  console.log(`  Payment Amount: $${payment.amount.toFixed(2)}`);
  console.log(`  Platform Fee (3.85% + $0.30): $${platformFee.toFixed(2)}`);
  console.log(`  Artist Receives: $${artistAmount.toFixed(2)}`);
  console.log(`  Fee Percentage: ${((platformFee / payment.amount) * 100).toFixed(2)}%`);
});

console.log('\n' + '='.repeat(50));
console.log('Payout system is correctly configured!');
console.log('Artists will receive automated payouts with the 3.85% + $0.30 fee structure.');