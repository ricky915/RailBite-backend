import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { IMenuItem } from '@/models/MenuItem.model';
import { menuItemSchema } from '@/models/MenuItem.model';

/**
 * `menus` collection (TRD 12.1). Each document represents a menu category
 * for a restaurant, embedding its items array directly.
 */
export interface IMenu extends Document {
  restaurantId: Types.ObjectId;
  categoryName: string;
  displayOrder: number;
  isAvailable: boolean;
  unavailableReason?: string;
  items: IMenuItem[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema = new Schema<IMenu>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    categoryName: { type: String, required: true, trim: true },
    displayOrder: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    unavailableReason: { type: String },
    items: { type: [menuItemSchema], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

menuSchema.index({ restaurantId: 1 });

export const MenuModel = model<IMenu>('Menu', menuSchema);
