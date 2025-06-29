/**
 * Add More Checkout Examples Script
 * Creates additional appointments that need checkout for dashboard demo
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './shared/schema.ts';
import { nanoid } from 'nanoid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function addCheckoutExamples() {
  try {
    console.log('Adding more checkout examples to dashboard...');

    // Get the first business to add appointments to
    const businesses = await db.query.businesses.findMany();
    if (!businesses.length) {
      console.log('No businesses found. Please create a business first.');
      return;
    }
    const businessId = businesses[0].id;

    // Get existing services
    const existingServices = await db.query.services.findMany({
      where: (services, { eq }) => eq(services.businessId, businessId)
    });

    if (!existingServices.length) {
      console.log('No services found. Please create services first.');
      return;
    }

    // Create additional client examples
    const newClients = [
      {
        id: nanoid(),
        businessId,
        firstName: 'Emma',
        lastName: 'Rodriguez',
        email: 'emma.rodriguez@email.com',
        phone: '(555) 234-5678',
        createdAt: new Date()
      },
      {
        id: nanoid(),
        businessId,
        firstName: 'Maya',
        lastName: 'Johnson',
        email: 'maya.johnson@email.com',
        phone: '(555) 345-6789',
        createdAt: new Date()
      },
      {
        id: nanoid(),
        businessId,
        firstName: 'Aria',
        lastName: 'Wilson',
        email: 'aria.wilson@email.com',
        phone: '(555) 456-7890',
        createdAt: new Date()
      },
      {
        id: nanoid(),
        businessId,
        firstName: 'Luna',
        lastName: 'Davis',
        email: 'luna.davis@email.com',
        phone: '(555) 567-8901',
        createdAt: new Date()
      }
    ];

    // Insert new clients
    for (const client of newClients) {
      await db.insert(clients).values(client);
    }

    console.log(`Created ${newClients.length} new clients`);

    // Create appointments that need checkout (2-3 hours ago)
    const now = new Date();
    const appointmentExamples = [
      {
        clientId: newClients[0].id,
        serviceId: existingServices[0].id,
        timeOffset: 3, // 3 hours ago
        duration: 90
      },
      {
        clientId: newClients[1].id,
        serviceId: existingServices[1] ? existingServices[1].id : existingServices[0].id,
        timeOffset: 2.5, // 2.5 hours ago
        duration: 120
      },
      {
        clientId: newClients[2].id,
        serviceId: existingServices[0].id,
        timeOffset: 4, // 4 hours ago
        duration: 60
      },
      {
        clientId: newClients[3].id,
        serviceId: existingServices[2] ? existingServices[2].id : existingServices[0].id,
        timeOffset: 2, // 2 hours ago
        duration: 90
      }
    ];

    for (const example of appointmentExamples) {
      const startTime = new Date(now.getTime() - (example.timeOffset * 60 * 60 * 1000));
      const endTime = new Date(startTime.getTime() + (example.duration * 60 * 1000));

      const appointment = {
        id: nanoid(),
        businessId,
        clientId: example.clientId,
        serviceId: example.serviceId,
        startTime,
        endTime,
        status: 'confirmed', // This makes them show up in checkout
        notes: 'Completed appointment ready for payment',
        createdAt: new Date()
      };

      await db.insert(appointments).values(appointment);
    }

    console.log(`Created ${appointmentExamples.length} appointments needing checkout`);
    console.log('✅ Successfully added checkout examples to dashboard');

  } catch (error) {
    console.error('Error adding checkout examples:', error);
  } finally {
    await pool.end();
  }
}

addCheckoutExamples();