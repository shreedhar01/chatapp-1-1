import { seedFriendTable } from './friendRequest.seed.js';
import { seedMessageTable } from './message.seed.js';
import { seedUsersTable } from './user.seed.js';

async function main() {
  await seedUsersTable();
  await seedFriendTable();
  await seedMessageTable();
  console.log('All seeds done');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});