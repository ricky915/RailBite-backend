export interface InvoiceView {
  id: string;
  invoiceNumber: string;
  orderId: string;
  pdfUrl: string;
  grandTotalPaise: number;
  isCreditNote: boolean;
  createdAt: Date;
}
