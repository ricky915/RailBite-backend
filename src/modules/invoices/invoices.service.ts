import { Order } from '@/models/Order.model';
import { Restaurant } from '@/models/Restaurant.model';
import { User } from '@/models/User.model';
import { uploadRawBuffer } from '@/services/cloudinary.service';
import { generateInvoicePdf } from '@/services/pdf.service';
import { ForbiddenError, NotFoundError } from '@/utils/errors';

import { invoicesRepository } from './invoices.repository';

export const invoicesService = {
  async getOrGenerate(orderIdOrHumanId: string, userId: string) {
    const order = /^[a-f0-9]{24}$/i.test(orderIdOrHumanId)
      ? await Order.findOne({ _id: orderIdOrHumanId, isDeleted: false })
      : await Order.findOne({ orderId: orderIdOrHumanId, isDeleted: false });
    if (!order) throw new NotFoundError('Order not found');
    if (order.passengerId.toString() !== userId) throw new ForbiddenError('You do not have access to this invoice');

    const existing = await invoicesRepository.findByOrderId(order._id.toString());
    if (existing) return existing;

    const [restaurant, passenger] = await Promise.all([Restaurant.findById(order.restaurantId), User.findById(order.passengerId)]);
    if (!restaurant || !passenger) throw new NotFoundError('Could not resolve order details for invoice generation');

    const invoiceNumber = await invoicesRepository.nextInvoiceNumber();

    const pdfBuffer = await generateInvoicePdf({
      invoiceNumber,
      orderId: order.orderId,
      createdAt: order.createdAt,
      restaurantName: restaurant.name,
      passengerName: passenger.name,
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price, itemTotal: i.itemTotal })),
      subtotalPaise: order.subtotal,
      gstAmountPaise: order.gstAmountPaise,
      deliveryFeePaise: order.deliveryFeePaise,
      platformFeePaise: order.platformFeePaise,
      discountPaise: order.couponDiscountPaise,
      grandTotalPaise: order.grandTotal,
    });

    const pdfUrl = await uploadRawBuffer(pdfBuffer, 'railbite/invoices', invoiceNumber);

    return invoicesRepository.create({
      orderId: order._id,
      invoiceNumber,
      passengerId: order.passengerId,
      restaurantId: order.restaurantId,
      subtotalPaise: order.subtotal,
      gstAmountPaise: order.gstAmountPaise,
      deliveryFeePaise: order.deliveryFeePaise,
      platformFeePaise: order.platformFeePaise,
      discountPaise: order.couponDiscountPaise,
      grandTotalPaise: order.grandTotal,
      pdfUrl,
      generatedAt: new Date(),
    });
  },
};
