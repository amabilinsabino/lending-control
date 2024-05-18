// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "GET") {
    const lendings = await prisma.lending.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        deleted: false,
      },
    });

    if (lendings.length) {
      return res.status(200).json(lendings);
    }

    return res.status(200).json([]);
  }
  if (req.method === "POST") {
    if (req.body.id) {
      const data = {
        ...req.body,
      };
      delete data.id;
      const updated = await prisma.lending.update({
        where: {
          id: Number(req.body.id as string),
        },
        data,
      });
      return res.status(200).json(updated);
    }

    const newLending = await prisma.lending.create({
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(newLending);
  }
}
