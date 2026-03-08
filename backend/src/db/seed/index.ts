import { seedUsersTable } from './user.seed.js';

async function main() {
  await seedUsersTable();
  console.log('All seeds done');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});