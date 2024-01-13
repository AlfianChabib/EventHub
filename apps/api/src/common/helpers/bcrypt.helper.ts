import { hashSync, compareSync, genSaltSync } from 'bcrypt';

export const hash = (password: string): string => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

export const compare = (password: string, hashedPassword: string): boolean => {
  return compareSync(password, hashedPassword);
};
