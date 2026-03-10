import { hashPassword } from '../../utils/bcrypt.js';
import { db } from '../index.js';
import { users } from '../schema.js';

const seedUsers = [
  { name: 'Eleven', email: 'eleven@seed.com', password: '12345six' },
  { name: 'Twelve', email: 'twelve@seed.com', password: '12345six' },
  { name: 'Thirteen', email: 'thirteen@test.com', password: '12345six' },
  { name: 'Fourteen', email: 'fourteen@seed.com', password: '12345six' },
  { name: 'Fifteen', email: 'fifteen@seed.com', password: '12345six' },
  { name: 'Sixteen', email: 'sixteen@seed.com', password: '12345six' },
  { name: 'Seventeen', email: 'seventeen@seed.com', password: '12345six' },
  { name: 'Eighteen', email: 'eighteen@seed.com', password: '12345six' },
  { name: 'Nineteen', email: 'nineteen@seed.com', password: '12345six' },
  
  { name: 'Twenty', email: 'twenty@seed.com', password: '12345six' },
  { name: 'Twenty One', email: 'twentyone@seed.com', password: '12345six' },
  { name: 'Twenty Two', email: 'twentytwo@seed.com', password: '12345six' },
  { name: 'Twenty Three', email: 'twentythree@seed.com', password: '12345six' },
  { name: 'Twenty Four', email: 'twentyfour@seed.com', password: '12345six' },
  { name: 'Twenty Five', email: 'twentyfive@seed.com', password: '12345six' },
  { name: 'Twenty Six', email: 'twentysix@seed.com', password: '12345six' },
  { name: 'Twenty Seven', email: 'twentyseven@seed.com', password: '12345six' },
  { name: 'Twenty Eight', email: 'twentyeight@seed.com', password: '12345six' },
  { name: 'Twenty Nine', email: 'twentynine@seed.com', password: '12345six' },

  { name: 'Thirty', email: 'thirty@seed.com', password: '12345six' },
  { name: 'Thirty One', email: 'thirtyone@seed.com', password: '12345six' },
  { name: 'Thirty Two', email: 'thirtytwo@seed.com', password: '12345six' },
  { name: 'Thirty Three', email: 'thirtythree@seed.com', password: '12345six' },
  { name: 'Thirty Four', email: 'thirtyfour@seed.com', password: '12345six' },
  { name: 'Thirty Five', email: 'thirtyfive@seed.com', password: '12345six' },
  { name: 'Thirty Six', email: 'thirtysix@seed.com', password: '12345six' },
  { name: 'Thirty Seven', email: 'thirtyseven@seed.com', password: '12345six' },
  { name: 'Thirty Eight', email: 'thirtyeight@seed.com', password: '12345six' },
  { name: 'Thirty Nine', email: 'thirtynine@seed.com', password: '12345six' },

  { name: 'Forty', email: 'forty@seed.com', password: '12345six' },
  { name: 'Forty One', email: 'fortyone@seed.com', password: '12345six' },
  { name: 'Forty Two', email: 'fortytwo@seed.com', password: '12345six' },
  { name: 'Forty Three', email: 'fortythree@seed.com', password: '12345six' },
  { name: 'Forty Four', email: 'fortyfour@seed.com', password: '12345six' },
  { name: 'Forty Five', email: 'fortyfive@seed.com', password: '12345six' },
  { name: 'Forty Six', email: 'fortysix@seed.com', password: '12345six' },
  { name: 'Forty Seven', email: 'fortyseven@seed.com', password: '12345six' },
  { name: 'Forty Eight', email: 'fortyeight@seed.com', password: '12345six' },
  { name: 'Forty Nine', email: 'fortynine@seed.com', password: '12345six' },

  { name: 'Fifty', email: 'fifty@seed.com', password: '12345six' },
  { name: 'Fifty One', email: 'fiftyone@seed.com', password: '12345six' },
  { name: 'Fifty Two', email: 'fiftytwo@seed.com', password: '12345six' },
  { name: 'Fifty Three', email: 'fiftythree@seed.com', password: '12345six' },
  { name: 'Fifty Four', email: 'fiftyfour@seed.com', password: '12345six' },
  { name: 'Fifty Five', email: 'fiftyfive@seed.com', password: '12345six' },
  { name: 'Fifty Six', email: 'fiftysix@seed.com', password: '12345six' },
  { name: 'Fifty Seven', email: 'fiftyseven@seed.com', password: '12345six' },
  { name: 'Fifty Eight', email: 'fiftyeight@seed.com', password: '12345six' },
  { name: 'Fifty Nine', email: 'fiftynine@seed.com', password: '12345six' },

  { name: 'Sixty', email: 'sixty@seed.com', password: '12345six' },
];

export async function seedUsersTable() {
  console.log('Seeding users...');

  for (const user of seedUsers) {
    const hashed = await hashPassword(user.password)

    await db
      .insert(users)
      .values({
        name: user.name,
        email: user.email,
        password: hashed,
        status: 'offline',
      })
      .onConflictDoNothing();
  }

  console.log(`Seeded ${seedUsers.length} users`);
}