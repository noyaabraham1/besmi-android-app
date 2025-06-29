-- Add more clients and appointments that need checkout
-- This creates realistic data for the dashboard demo

-- First, let's get the business and service IDs to use
-- Insert additional clients
INSERT INTO clients (id, business_id, first_name, last_name, email, phone, created_at)
SELECT 
  gen_random_uuid(),
  b.id,
  client_data.first_name,
  client_data.last_name,
  client_data.email,
  client_data.phone,
  NOW() - INTERVAL '1 week'
FROM businesses b,
(VALUES 
  ('Emma', 'Rodriguez', 'emma.rodriguez@email.com', '(555) 234-5678'),
  ('Maya', 'Johnson', 'maya.johnson@email.com', '(555) 345-6789'),
  ('Aria', 'Wilson', 'aria.wilson@email.com', '(555) 456-7890'),
  ('Luna', 'Davis', 'luna.davis@email.com', '(555) 567-8901'),
  ('Zoe', 'Martinez', 'zoe.martinez@email.com', '(555) 678-9012'),
  ('Isla', 'Brown', 'isla.brown@email.com', '(555) 789-0123')
) AS client_data(first_name, last_name, email, phone)
WHERE b.id = (SELECT id FROM businesses LIMIT 1)
ON CONFLICT (email) DO NOTHING;

-- Insert appointments that need checkout (completed 2-4 hours ago)
INSERT INTO appointments (id, business_id, client_id, service_id, start_time, end_time, status, notes, created_at)
SELECT 
  gen_random_uuid(),
  c.business_id,
  c.id,
  s.id,
  NOW() - INTERVAL '3 hours' + (random() * INTERVAL '2 hours'),
  NOW() - INTERVAL '1.5 hours' + (random() * INTERVAL '1 hour'),
  'confirmed',
  'Appointment completed, ready for checkout',
  NOW() - INTERVAL '1 week'
FROM clients c
JOIN services s ON s.business_id = c.business_id
WHERE c.email IN (
  'emma.rodriguez@email.com',
  'maya.johnson@email.com', 
  'aria.wilson@email.com',
  'luna.davis@email.com',
  'zoe.martinez@email.com',
  'isla.brown@email.com'
)
AND c.business_id = (SELECT id FROM businesses LIMIT 1)
ORDER BY random()
LIMIT 6;