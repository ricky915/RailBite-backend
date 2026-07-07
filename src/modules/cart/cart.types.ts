export interface CartValidationItemResult {
  menuItemId: string;
  isAvailable: boolean;
  priceChanged: boolean;
  currentPricePaise?: number;
}

export interface CartValidationResult {
  isValid: boolean;
  items: CartValidationItemResult[];
  subtotalPaise: number;
  deliveryFeePaise: number;
  platformFeePaise: number;
  gstPaise: number;
  grandTotalPaise: number;
  minOrderValueMetPaise: boolean;
  deliveryWindowOk: boolean;
}
