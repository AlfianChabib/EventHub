import prisma from '@/prisma';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { generateReferral } from '@/common/helpers/referral.helper';
import { compare, hash } from '@/common/helpers/bcrypt.helper';
import { generateToken } from '@/common/helpers/jwt.helper';

export interface inputPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  referralCode?: string | undefined;
}

export interface signinPayload {
  email: string;
  password: string;
}

export const signinUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: signinPayload = req.body;

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userWithEmail) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Email or Password does not match!',
      });
    }

    const isValidPassword = compare(password, userWithEmail.password);

    if (!isValidPassword) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Email or Password does not match!',
      });
    }

    const jwtToken: string = generateToken({
      id: userWithEmail.id,
      username: userWithEmail.username,
      email: userWithEmail.email,
      role: userWithEmail.role,
    });

    res.cookie('user-token', jwtToken, {
      secure: false,
      httpOnly: true,
      expires: dayjs().add(7, 'days').toDate(),
    });

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, referralCode }: inputPayload =
      req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // check username and email
    if (user?.username === username) {
      return res.status(400).send({
        code: 400,
        success: false,
        message: 'Username already exists please enter different username',
      });
    }

    if (user?.email === email) {
      return res.status(400).send({
        code: 400,
        success: false,
        message: 'Email already exists, login to your account',
      });
    }

    // generator referral code
    const referral = generateReferral(username);
    // expire date
    const expireDate = dayjs().add(90, 'days').toDate();
    // hash password
    const hashedPassword = hash(password);

    if (!referralCode) {
      const createUser = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          referral,
        },
      });

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Register User successfully, you can login with your email and password`,
        data: {
          ...createUser,
          password: null,
        },
      });
    }

    // referral is entered by user
    if (referralCode) {
      const userReferral = await prisma.user.findFirst({
        where: {
          referral: referralCode,
        },
        select: {
          id: true,
        },
      });

      if (!userReferral) {
        return res.status(400).json({
          code: 400,
          success: false,
          message: `Referral code ${referralCode} not found, please check and try again`,
        });
      }

      const referralTransaction = await prisma.$transaction(async (prisma) => {
        const createUser = await prisma.user.create({
          data: {
            name,
            username,
            email,
            password: hashedPassword,
            referral,
          },
        });
        const createPoint = await prisma.point.create({
          data: {
            userId: userReferral?.id,
            expireDate,
          },
        });
        const createVoucher = await prisma.voucher.create({
          data: {
            userId: createUser?.id,
            expireDate,
          },
        });
        return { createUser, createPoint, createVoucher };
      });

      return res.status(200).json({
        code: 200,
        success: true,
        message: `Register User with Referral code ${referralCode} successfully, you can login with your email and password`,
        data: {
          ...referralTransaction.createUser,
          password: null,
          pointAuthor: referralTransaction.createPoint,
          voucher: referralTransaction.createVoucher,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const signoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie('user-token');
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getSessionUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        ...user,
        password: null,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};
