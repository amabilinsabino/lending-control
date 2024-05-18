// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id: string = req.query.id as string;
  const user = await prisma.user.findFirst({
    where: {
      document: id,
    },
  });

  if (user) {
    return res.status(200).json(user);
  }

  res.status(404).json({ error: "Not found" });
}
