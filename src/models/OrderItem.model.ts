import type { Types } from 'mongoose';
import { Schema } from 'mongoose';

import type { CustomizationSnapshot } from '@/types/domain.types';

/**
 * Subdocument snapshot of an ordered item at the time of order placement
 * (TRD 12.2.2, 12.4 "Snapshots"). Embedded inside `Order.items`; menu item
 * changes never retroactively affect past orders.
 */
export interface IOrderItem {
  menuItemId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  customizations: CustomizationSnapshot[];
  specialNote?: string;
  itemTotal: number;
}

const customizationSnapshotSchema = new Schema<CustomizationSnapshot>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    additionalCharge: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

export const orderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 10 },
    customizations: { type: [customizationSnapshotSchema], default: [] },
    specialNote: { type: String, maxlength: 200 },
    itemTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);
