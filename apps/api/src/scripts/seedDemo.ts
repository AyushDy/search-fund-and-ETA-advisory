import argon2 from 'argon2';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { getConfig } from '../config/env';
import { BusinessListing } from '../models/BusinessListing';
import { User } from '../models/User';

const demoPassword = process.env.DEMO_PASSWORD ?? 'DemoPassword123!';

async function upsertUser(input: { email: string; firstName: string; lastName: string; role: 'INVESTOR' | 'STAFF' | 'APPROVER' | 'ADMIN' }) {
  const passwordHash = await argon2.hash(demoPassword, { type: argon2.argon2id });
  return User.findOneAndUpdate({ email: input.email }, { $setOnInsert: { ...input, passwordHash, status: 'ACTIVE' } }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
}

async function seed() {
  const config = getConfig();
  if (config.NODE_ENV === 'production') throw new Error('Demo seed data is disabled in production');
  await connectDatabase(config.MONGODB_URI, config.DNS_SERVERS);
  const [staff, approver, investor] = await Promise.all([
    upsertUser({ email: 'demo.staff@example.com', firstName: 'Demo', lastName: 'Staff', role: 'STAFF' }),
    upsertUser({ email: 'demo.approver@example.com', firstName: 'Demo', lastName: 'Approver', role: 'APPROVER' }),
    upsertUser({ email: 'demo.investor@example.com', firstName: 'Demo', lastName: 'Investor', role: 'INVESTOR' })
  ]);
  const listings = [
    { publicTitle: 'Regional HVAC Services Platform', identityMode: 'ANONYMIZED', shortSummary: 'Established commercial HVAC maintenance provider serving a recurring regional customer base.', description: 'A practical services business with a long operating history and recurring maintenance relationships.', industry: 'Business Services', subIndustry: 'HVAC Services', country: 'United States', region: 'Midwest', city: 'Chicago', productsAndServices: 'Commercial HVAC maintenance, repair, and installation.', yearsOperating: 18, employeeRange: '25-50', revenue: { amount: 4200000, currency: 'USD', period: 'FY2025' }, ebitda: { amount: 780000, currency: 'USD', period: 'FY2025' }, askingPrice: { amount: 3200000, currency: 'USD' } },
    { publicTitle: 'Specialty Packaging Manufacturer', legalBusinessName: 'Northstar Packaging Co.', publicWebsite: 'https://example.com', identityMode: 'IDENTIFIED', shortSummary: 'Niche packaging manufacturer with diversified customers and available capacity for growth.', description: 'A specialty manufacturer producing short-run packaging for food and consumer product companies.', industry: 'Manufacturing', subIndustry: 'Packaging', country: 'United States', region: 'Southeast', city: 'Atlanta', productsAndServices: 'Custom cartons, labels, and short-run packaging.', yearsOperating: 24, employeeRange: '50-100', revenue: { amount: 6800000, currency: 'USD', period: 'FY2025' }, ebitda: { amount: 1100000, currency: 'USD', period: 'FY2025' }, askingPrice: { amount: 5400000, currency: 'USD' } },
    { publicTitle: 'Managed IT Support Provider', identityMode: 'ANONYMIZED', shortSummary: 'Managed IT and cybersecurity support provider with a strong small-business customer base.', description: 'A recurring-revenue technology services business focused on support and security for growing companies.', industry: 'Technology', subIndustry: 'Managed IT Services', country: 'United States', region: 'Northeast', city: 'Boston', productsAndServices: 'Managed support, cloud administration, and cybersecurity services.', yearsOperating: 11, employeeRange: '10-25', revenue: { amount: 2100000, currency: 'USD', period: 'FY2025' }, askingPrice: { amount: 1900000, currency: 'USD' } }
  ];
  for (const input of listings) {
    await BusinessListing.findOneAndUpdate({ publicTitle: input.publicTitle }, { $setOnInsert: { ...input, status: 'APPROVED', createdBy: staff!._id, updatedBy: approver!._id, reviewedBy: approver!._id, reviewedAt: new Date(), featured: false } }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  }
  console.log(`Demo data ready. Login password: ${demoPassword}`);
  console.log('Accounts: demo.staff@example.com, demo.approver@example.com, demo.investor@example.com');
  await disconnectDatabase();
  void investor;
}

seed().catch(async (error: unknown) => { console.error(error); await disconnectDatabase(); process.exit(1); });
