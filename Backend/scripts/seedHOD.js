import dotenv from 'dotenv';
import connectDB from "../src/config/db.js";
import User from "../src/models/user.model.js";
import Department from "../src/models/department.model.js";
import bcrypt from 'bcryptjs';

dotenv.config();

function parseArgs() {
  const argv = process.argv.slice(2);
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

async function main() {
  const { name = 'HOD', email = 'hodpaint@paintshop.com', password = 'hod123', department = 'Paint Shop' } = parseArgs();

  await connectDB();

  try {
    let dept = await Department.findOne({ name: department });
    if (!dept) {
      dept = await Department.create({ name: department, description: `${department} (created by seed script)` });
      console.log(`Created department: ${dept.name} (${dept._id})`);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User with email ${email} already exists (id: ${existing._id}). Aborting seed.`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: 'HOD',
      department: dept._id,
    });

    console.log(`HOD user created: ${user.email} (id: ${user._id})`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding HOD:', err);
    process.exit(1);
  }
}

main();