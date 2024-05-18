// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'DELETE') {
        const product = await prisma.product.update({
            where: {
                id: Number(req.query.id)
            },
            data: {
                deleted: true
            }
        });

        res.status(200).json(product)




    }

}
