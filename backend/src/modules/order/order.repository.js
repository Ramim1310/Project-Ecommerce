
const prisma = require("../../../config/db");

class OrderRepository {
    async createOrderWithStockUpdate(userId, items, totalAmount, shippingAddress) {
    return await prisma.$transaction(async (tx) => {

            // Pre-validate all stock levels before making any writes.
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

            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    shippingAddress,
                    items: {
                        create: items.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: parseFloat(item.price)  // Decimal serializes as string; cast to Float
                        }))
                    }
                },
                include: { items: true }
            });

            // Decrement stock only after the order row is committed.
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
        const safePage = Math.max(0, parseInt(page) || 0);
        const PER_PAGE = 15;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                take: PER_PAGE,
                skip: safePage * PER_PAGE,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true } },
                    items: {
                        include: {
                            variant: {
                                select: {
                                    variantName: true,
                                    sku: true,
                                    product: { select: { name: true } }
                                }
                            }
                        }
                    }
                }
            }),
            prisma.order.count()
        ]);

        return { orders, total, page: safePage };
    }

    async updateStatus(orderId, status) {
        return await prisma.order.update({
            where: { id: orderId },
            data: { status },
            select: { id: true, status: true, updatedAt: true }
        });
    }

    async updateOrderStatus(id, status, paymentStatus) {
        const data = { status };
        if (paymentStatus) {
            data.paymentStatus = paymentStatus;
        }
        return await prisma.order.update({
            where: { id },
            data
        });
    }


    async findOrdersByUser(userId) {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findById(id) {
        return await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });
    }
}

module.exports = new OrderRepository();