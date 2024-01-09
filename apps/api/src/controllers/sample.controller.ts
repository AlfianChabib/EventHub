import { Request, Response } from 'express';
import prisma from '@/prisma';

export class SampleController {
  async getSampleData(req: Request, res: Response) {
    const sampleData = await prisma.user.findMany();

    return res.status(200).send(sampleData);
  }

  async createUser(req: Request, res: Response) {
    const { username, email, password, referral } = req.body;

    const createUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        referral,
      },
    });

    return res.status(200).send(createUser);
  }
}
