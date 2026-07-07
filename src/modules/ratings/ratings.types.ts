export interface RatingView {
  id: string;
  orderId: string;
  restaurantId: string;
  userId: string;
  stars: number;
  reviewText?: string;
  photoUrls: string[];
  restaurantResponse?: string;
  isEditable: boolean;
  createdAt: Date;
}
