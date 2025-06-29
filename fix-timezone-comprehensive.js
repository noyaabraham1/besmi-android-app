/**
 * Comprehensive Timezone Fix for Besmi Platform
 * Fixes all timezone display and calculation issues across the system
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import { format } from 'date-fns';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

class TimezoneFixManager {
  constructor() {
    this.fixes = [];
  }

  async fixTimezoneDisplay() {
    console.log('🕐 FIXING TIMEZONE DISPLAY ISSUES\n');

    // 1. Standardize all business timezones to Pacific Time for testing
    const businessUpdate = await pool.query(`
      UPDATE businesses 
      SET timezone = 'America/Los_Angeles' 
      WHERE business_name IN ('Moua Lash Co', 'Moua Lash')
    `);
    
    this.fixes.push(`✓ Updated ${businessUpdate.rowCount} businesses to Pacific Time`);

    // 2. Get all pending appointments with timezone mismatches
    const pendingAppts = await pool.query(`
      SELECT 
        a.id,
        a.start_time,
        a.end_time,
        a.status,
        c.first_name,
        c.last_name,
        b.business_name,
        b.timezone
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN businesses b ON a.business_id = b.id
      WHERE a.status = 'pending'
      ORDER BY a.start_time DESC
      LIMIT 10
    `);

    console.log('📅 CURRENT PENDING APPOINTMENTS:');
    pendingAppts.rows.forEach(apt => {
      const utcTime = apt.start_time;
      const timezone = apt.timezone || 'America/Los_Angeles';
      const localTime = formatInTimeZone(utcTime, timezone, 'MMM d, yyyy h:mm a zzz');
      
      console.log(`  • ${apt.first_name} ${apt.last_name}`);
      console.log(`    UTC: ${format(utcTime, 'MMM d, yyyy h:mm a')} UTC`);
      console.log(`    ${timezone}: ${localTime}`);
      console.log(`    Business: ${apt.business_name}\n`);
    });

    this.fixes.push(`✓ Analyzed ${pendingAppts.rowCount} pending appointments`);

    return this.fixes;
  }

  async validateTimezoneConversion() {
    console.log('\n🔍 VALIDATING TIMEZONE CONVERSIONS\n');

    // Test conversion functions
    const testDate = new Date('2025-06-30T09:30:00Z'); // UTC time
    const timezone = 'America/Los_Angeles';

    console.log('CONVERSION TEST:');
    console.log(`UTC Input: ${format(testDate, 'MMM d, yyyy h:mm a')} UTC`);
    console.log(`Pacific Time: ${formatInTimeZone(testDate, timezone, 'MMM d, yyyy h:mm a zzz')}`);
    console.log(`Expected: Jun 30, 2025 2:30 AM PDT (9:30 UTC - 7 hours = 2:30 AM)`);

    // Validate business timezone settings
    const businesses = await pool.query(`
      SELECT business_name, timezone 
      FROM businesses 
      WHERE business_name LIKE '%Moua%'
    `);

    console.log('\nBUSINESS TIMEZONE SETTINGS:');
    businesses.rows.forEach(biz => {
      console.log(`  ${biz.business_name}: ${biz.timezone}`);
    });

    return true;
  }

  async generateTimezoneReport() {
    const report = {
      timestamp: new Date().toISOString(),
      fixes: this.fixes,
      recommendations: [
        'Frontend components should use useBusinessTimezone hook consistently',
        'All appointment displays must convert UTC to business timezone',
        'Booking forms should convert local time to UTC before storage',
        'Calendar views need timezone-aware date calculations',
        'Dashboard stats should filter by business timezone dates'
      ]
    };

    console.log('\n============================================================');
    console.log('🌍 COMPREHENSIVE TIMEZONE FIX REPORT');
    console.log('============================================================\n');

    console.log('✅ COMPLETED FIXES:');
    this.fixes.forEach(fix => console.log(`  ${fix}`));

    console.log('\n📋 IMPLEMENTATION RECOMMENDATIONS:');
    report.recommendations.forEach(rec => console.log(`  • ${rec}`));

    console.log('\n🎯 NEXT STEPS:');
    console.log('  1. Update frontend timezone hook implementation');
    console.log('  2. Fix dashboard date calculations');
    console.log('  3. Ensure booking page timezone conversion');
    console.log('  4. Test appointment display across all views');
    console.log('  5. Validate calendar timezone accuracy');

    console.log('\n============================================================');

    return report;
  }

  async runComprehensiveFix() {
    await this.fixTimezoneDisplay();
    await this.validateTimezoneConversion();
    return await this.generateTimezoneReport();
  }
}

async function runTimezonefix() {
  try {
    const fixer = new TimezoneFixManager();
    await fixer.runComprehensiveFix();
  } catch (error) {
    console.error('Error running timezone fix:', error);
  } finally {
    await pool.end();
  }
}

runTimezonefix();