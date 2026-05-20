
const prisma = require("../../../config/db");

class OrderRepository {
    async createOrderWithStockUpdate(userId, items, totalAmount, shippingAddress) {
        return await prisma.$transaction(async (tx) => {

            // 1. Check stock BEFORE decrementing 
            for (const item of items) {
                const variant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                    select: { id: true, stock: true }
                });

                if (!variant) {
                    throw new Error(`VARIANT_NOT_FOUND: ${item.variantId}`);
                }

                if (variant.stock < item.quantity) {
                    throw new Error(`INSUFFICIENT_STOCK: ${item.variantId}`);
                }
            }

            // 2. Create the Order with nested OrderItems
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    shippingAddress,
                    items: {
                        create: items.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: { items: true }
            });

            // 3. Decrement stock sequentially 
            for (const item of items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });
            }

            return order;
        });
    }

    
    async findAllForAdmin({ page } = {}) {
        // Guard against undefined, NaN, or negative page values
        const safePage = Math.max(0, parseInt(page) || 0);

        return await prisma.order.findMany({
            take: 10,
            skip: safePage * 10,
            include: {
                user: true,
                items: {
                    include: { variant: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

module.exports = new OrderRepository();