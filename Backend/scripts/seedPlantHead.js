import dotenv from 'dotenv';
import connectDB from "../src/config/db.js";
import User from "../src/models/user.model.js";
import bcrypt from 'bcryptjs';

dotenv.config();

async function main() {
  const email = process.argv[2] || 'planthead@paintshop.com';
  const password = process.argv[3] || 'plant123';

  await connectDB();
  try {
    if (await User.findOne({ email })) {
      console.log(`User with email ${email} already exists. Aborting seed.`);
      process.exit(0);
    }

    const user = await User.create({
      name: 'Plant Head',
      email,
      password: await bcrypt.hash(password, 10),
      role: 'PLANT_HEAD'
    });

    console.log(`Plant Head created: ${user.email} (id: ${user._id})`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Plant Head:', error);
    process.exit(1);
  }
}

main();
