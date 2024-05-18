// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'GET') {
        const products = await prisma.product.findMany({
            orderBy: {
                id: 'asc'
            },
            where: {
                deleted: false
            }
        });

        const lendings = await prisma.lending.findMany({
            where: {
                active: true
            }
        })

        const lendingsByProduct: any = lendings.reduce((acc, item) => {
            return {
                ...acc,
                [item.productId]: (acc?.[item.productId] || 0) + item.amount
            }
        }, {})

        if (products.length) {
            return res.status(200).json(products.map(product => ({
                ...product,
                lendingAmount: lendingsByProduct?.[product.id] || 0,
                availableAmount: product.quantityInStock - (lendingsByProduct?.[product.id] || 0)
            })));
        }

        return res.status(204).json([]);
    }

    if (req.method === 'POST') {
        if (req.body.id) {
            const data = {
                ...req.body
            }
            delete data.id
            const updated = await prisma.product.update({
                where: {
                    id: Number(req.body.id as string),

                },
                data
            })
            return res.status(200).json(updated)
        }

        const newProduct = await prisma.product.create({
            data: {
                ...req.body
            }
        })

        return res.status(200).json(newProduct)
    }




}
