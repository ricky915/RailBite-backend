import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

/**
 * `invoices` collection (TRD 12.1). Immutable after creation; references
 * the order. Invoice numbering is sequential per financial year
 * (e.g., RB/FY26-27/00001) per PRD 11.13.
 */
export interface IInvoice extends Document {
  invoiceNumber: string;
  orderId: Types.ObjectId;
  passengerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  financialYear: string;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalTaxPaise: number;
  grandTotalPaise: number;
  pdfUrl: string;
  isCreditNote: boolean;
  originalInvoiceId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    financialYear: { type: String, required: true },
    cgstPaise: { type: Number, default: 0, min: 0 },
    sgstPaise: { type: Number, default: 0, min: 0 },
    igstPaise: { type: Number, default: 0, min: 0 },
    totalTaxPaise: { type: Number, default: 0, min: 0 },
    grandTotalPaise: { type: Number, required: true, min: 0 },
    pdfUrl: { type: String, required: true },
    isCreditNote: { type: Boolean, default: false },
    originalInvoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
  },
  { timestamps: true },
);

export const InvoiceModel = model<IInvoice>('Invoice', invoiceSchema);