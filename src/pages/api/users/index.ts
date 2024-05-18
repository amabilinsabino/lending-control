// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });

    if (users.length) {
      return res.status(200).json(users);
    }

    res.status(204).json(users);
  }

  if (req.method === "POST") {
    if (req.body.id) {
      const data = {
        ...req.body,
      };
      delete data.id;
      const updated = await prisma.user.update({
        where: {
          id: Number(req.body.id as string),
        },
        data,
      });
      return res.status(200).json(updated);
    }

    const newUser = await prisma.user.create({
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(newUser);
  }
}
