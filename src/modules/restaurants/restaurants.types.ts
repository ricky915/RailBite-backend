export interface RestaurantListItemView {
  id: string;
  name: string;
  cuisineTypes: string[];
  averageRating: number;
  ratingCount: number;
  isVegOnly: boolean;
  minOrderValuePaise: number;
  deliveryFeePaise: number;
  status: 'open' | 'busy' | 'closed';
  acceptingOrdersUntil?: string;
}

export interface RestaurantDetailView extends RestaurantListItemView {
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  logoUrl?: string;
  bannerUrl?: string;
}
