import { Logger } from '@nestjs/common';
import { hashSync } from 'bcrypt';

const plainPassword = process.argv[2];
if (!plainPassword) {
  Logger.error('Plain password is required at third argument');
  process.exit(1);
}

const hashedPassword = hashSync(plainPassword, 10);
Logger.log(`Password hashed : ${hashedPassword}`);
process.exit(0);
