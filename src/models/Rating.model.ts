import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

/**
 * `ratings` collection (TRD 12.1). One rating per order; references
 * order, restaurant, and user.
 */
export interface IRating extends Document {
  orderId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  userId: Types.ObjectId;
  stars: number;
  reviewText?: string;
  photoUrls: string[];
  restaurantResponse?: string;
  isFlagged: boolean;
  isHidden: boolean;
  isEditable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, maxlength: 500 },
    photoUrls: { type: [String], default: [] },
    restaurantResponse: { type: String },
    isFlagged: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    isEditable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ratingSchema.index({ restaurantId: 1, createdAt: -1 });

export const RatingModel = model<IRating>('Rating', ratingSchema);
