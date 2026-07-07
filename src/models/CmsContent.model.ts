import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type CmsContentType = 'faq' | 'banner' | 'notification_template' | 'terms' | 'privacy_policy';

/**
 * `cmsContent` collection (TRD 12.1). Generic, versioned content store
 * for FAQs, banners, notification templates, and legal pages (PRD 11.19).
 */
export interface ICmsContent extends Document {
  type: CmsContentType;
  key: string;
  title: string;
  body: string;
  imageUrl?: string;
  linkUrl?: string;
  displayOrder: number;
  version: number;
  isPublished: boolean;
  publishAt?: Date;
  unpublishAt?: Date;
  isDeleted: boolean;
  authorId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cmsContentSchema = new Schema<ICmsContent>(
  {
    type: {
      type: String,
      enum: ['faq', 'banner', 'notification_template', 'terms', 'privacy_policy'],
      required: true,
    },
    key: { type: String, required: true },
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 2000 },
    imageUrl: { type: String },
    linkUrl: { type: String },
    displayOrder: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: false },
    publishAt: { type: Date },
    unpublishAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

cmsContentSchema.index({ type: 1, key: 1 });

export const CmsContentModel = model<ICmsContent>('CmsContent', cmsContentSchema);
