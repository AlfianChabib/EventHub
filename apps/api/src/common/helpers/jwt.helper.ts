import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (user: any) => {
  return sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
  );
};

export const verifyToken = (
  token: string,
): { isValid: boolean; data?: any } => {
  try {
    const verifiedToken = verify(token, JWT_SECRET);
    return {
      isValid: true,
      data: verifiedToken,
    };
  } catch {
    return {
      isValid: false,
    };
  }
};
