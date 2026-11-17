import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required to run seed.');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function main() {
  console.log('🌱 Seeding base data...');

  // 1. Kategoriyalar
  await db.insert(schema.categories).values([
    { slug: 'yutuqlar', name: "O'quvchilar yutuqlari", sortOrder: 1 },
    { slug: 'tadbir', name: 'Ilmiy va madaniy tadbirlar', sortOrder: 2 },
    { slug: 'elonlar', name: "Muhim e'lonlar", sortOrder: 3 },
    { slug: 'talim', name: "Ta'lim yangiliklari", sortOrder: 4 },
  ]).onConflictDoNothing();

  // 2. Fanlar
  await db.insert(schema.subjects).values([
    { name: 'Matematika', icon: 'Calculator' },
    { name: 'Fizika', icon: 'Atom' },
    { name: 'Informatika va IT', icon: 'Laptop' },
    { name: 'Kimyo', icon: 'FlaskConical' },
    { name: 'Biologiya', icon: 'Dna' },
    { name: 'Ingliz tili', icon: 'Languages' },
    { name: 'Ona tili va adabiyot', icon: 'BookOpen' },
  ]).onConflictDoNothing();

  // Yo'nalishlar, rahbariyat, o'qituvchilar, yangiliklar, albomlar va aloqa ma'lumotlari
  // admin panel orqali real ma'lumot bilan kiritiladi.
  await db.insert(schema.siteSettings).values([
    { key: 'admission_portal_url', value: 'https://ariza.piima.uz', description: 'Rasmiy ariza portali havolasi' },
  ]).onConflictDoNothing();

  console.log('✅ Base data seeded successfully!');
  await client.end();
}

main().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
