import type { SupportTicketCategory, SupportTicketStatus } from '@/types/domain.types';

export interface SupportTicketView {
  id: string;
  ticketNumber: string;
  category: SupportTicketCategory;
  description: string;
  status: SupportTicketStatus;
  priority: 'standard' | 'priority';
  createdAt: Date;
}
