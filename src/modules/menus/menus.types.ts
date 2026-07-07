export interface MenuCategoryView {
  id: string;
  restaurantId: string;
  categoryName: string;
  displayOrder: number;
  isAvailable: boolean;
  items: MenuItemView[];
}

export interface MenuItemView {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  pricePaise: number;
  dietaryTag: string;
  preparationTimeMinutes: number;
  isAvailable: boolean;
}
