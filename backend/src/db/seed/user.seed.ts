import { hashPassword } from '../../utils/bcrypt.js';
import { db } from '../index.js';
import { users } from '../schema.js';

const seedUsers = [
  { name: 'Eleven',    email: 'eleven@seed.com',    password: '12345six' },
  { name: 'Twelve',    email: 'twelve@seed.com',    password: '12345six' },
  { name: 'Thirteen',  email: 'thirteen@test.com',  password: '12345six' },
  { name: 'Fourteen',  email: 'fourteen@seed.com',  password: '12345six' },
  { name: 'Fifteen',   email: 'fifteen@seed.com',   password: '12345six' },
  { name: 'Sixteen',   email: 'sixteen@seed.com',   password: '12345six' },
  { name: 'Seventeen', email: 'seventeen@seed.com', password: '12345six' },
  { name: 'Eighteen',  email: 'eighteen@seed.com',  password: '12345six' },
  { name: 'Nineteen',  email: 'nineteen@seed.com',  password: '12345six' },
  { name: 'Twenty',    email: 'twenty@seed.com',    password: '12345six' },
];

export async function seedUsersTable() {
  console.log('Seeding users...');

  for (const user of seedUsers) {
    const hashed = await hashPassword(user.password)

    await db
      .insert(users)
      .values({
        name:     user.name,
        email:    user.email,
        password: hashed,
        status:   'offline',
      })
      .onConflictDoNothing();
  }

  console.log(`Seeded ${seedUsers.length} users`);
}