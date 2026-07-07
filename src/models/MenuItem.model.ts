import { Schema } from 'mongoose';

export type DietaryTag = 'veg' | 'non_veg' | 'vegan' | 'egg';

export interface ICustomizationOption {
  label: string;
  additionalChargePaise: number;
}

export interface ICustomizationGroup {
  name: string;
  required: boolean;
  options: ICustomizationOption[];
}

/**
 * Subdocument representing a single menu item. Embedded inside a
 * `Menu` category document's `items` array (TRD 12.1 embedding strategy).
 * Not registered as its own Mongoose model/collection.
 */
export interface IMenuItem {
  _id: Schema.Types.ObjectId;
  name: string;
  description?: string;
  photoUrl?: string;
  pricePaise: number;
  dietaryTag: DietaryTag;
  preparationTimeMinutes: number;
  isAvailable: boolean;
  customizationGroups: ICustomizationGroup[];
}

const customizationOptionSchema = new Schema<ICustomizationOption>(
  {
    label: { type: String, required: true },
    additionalChargePaise: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const customizationGroupSchema = new Schema<ICustomizationGroup>(
  {
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: { type: [customizationOptionSchema], default: [] },
  },
  { _id: false },
);

export const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    photoUrl: { type: String },
    pricePaise: { type: Number, required: true, min: 0 },
    dietaryTag: { type: String, enum: ['veg', 'non_veg', 'vegan', 'egg'], required: true },
    preparationTimeMinutes: { type: Number, default: 15, min: 0 },
    isAvailable: { type: Boolean, default: true },
    customizationGroups: { type: [customizationGroupSchema], default: [] },
  },
  { _id: true },
);
