import PDFDocument from 'pdfkit';

import { uploadFile } from '@/services/cloudinary.service';
import { logger } from '@/utils/logger';

export interface InvoiceLineItem {
  name: string;
  quantity: number;
  unitPricePaise: number;
  itemTotalPaise: number;
}

export interface InvoicePdfData {
  invoiceNumber: string;
  orderId: string;
  orderDate: Date;
  restaurantName: string;
  restaurantGstin?: string;
  passengerName: string;
  trainNumber: string;
  deliveryStation: string;
  items: InvoiceLineItem[];
  subtotalPaise: number;
  deliveryFeePaise: number;
  platformFeePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  discountPaise: number;
  grandTotalPaise: number;
  paymentMode: string;
}

function formatRupees(paise: number): string {
  return `Rs. ${(paise / 100).toFixed(2)}`;
}

/**
 * Renders an invoice PDF in-memory using PDFKit (TRD 5.5). Kept
 * deliberately decoupled from any queue/worker so it can be moved behind
 * a background job in Phase 2 without touching call sites (TRD 30.2).
 */
function renderInvoicePdfBuffer(data: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('RailBite', { align: 'left' });
    doc.fontSize(10).text('Tax Invoice', { align: 'left' });
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Invoice Number: ${data.invoiceNumber}`);
    doc.text(`Order ID: ${data.orderId}`);
    doc.text(`Order Date: ${data.orderDate.toISOString()}`);
    doc.text(`Restaurant: ${data.restaurantName}${data.restaurantGstin ? ` (GSTIN: ${data.restaurantGstin})` : ''}`);
    doc.text(`Passenger: ${data.passengerName}`);
    doc.text(`Train: ${data.trainNumber} | Delivery Station: ${data.deliveryStation}`);
    doc.text(`Payment Mode: ${data.paymentMode}`);
    doc.moveDown();

    doc.fontSize(11).text('Items', { underline: true });
    data.items.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.name}  x${item.quantity}  ${formatRupees(item.unitPricePaise)}  =  ${formatRupees(item.itemTotalPaise)}`,
        );
    });
    doc.moveDown();

    doc.fontSize(11).text('Summary', { underline: true });
    doc.fontSize(10).text(`Subtotal: ${formatRupees(data.subtotalPaise)}`);
    doc.text(`Delivery Fee: ${formatRupees(data.deliveryFeePaise)}`);
    doc.text(`Platform Fee: ${formatRupees(data.platformFeePaise)}`);
    doc.text(`CGST: ${formatRupees(data.cgstPaise)}`);
    doc.text(`SGST: ${formatRupees(data.sgstPaise)}`);
    doc.text(`IGST: ${formatRupees(data.igstPaise)}`);
    doc.text(`Discount: -${formatRupees(data.discountPaise)}`);
    doc.fontSize(12).text(`Grand Total: ${formatRupees(data.grandTotalPaise)}`, { underline: true });

    doc.end();
  });
}

/**
 * Generates the invoice PDF and uploads it to Cloudinary, returning the
 * secure URL to persist on the `invoices` collection (PRD 11.13).
 *
 * @throws {ExternalServiceError} (via `uploadFile`) if the Cloudinary upload fails.
 */
export async function generateAndUploadInvoicePdf(data: InvoicePdfData): Promise<string> {
  const buffer = await renderInvoicePdfBuffer(data);
  const result = await uploadFile(buffer, 'railbite/invoices');
  logger.info('Invoice PDF generated and uploaded', { invoiceNumber: data.invoiceNumber, url: result.url });
  return result.url;
}
