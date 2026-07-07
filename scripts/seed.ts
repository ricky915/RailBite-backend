import { connectDatabase, disconnectDatabase } from '@/config/database';
import { MenuModel } from '@/models/Menu.model';
import { RestaurantModel } from '@/models/Restaurant.model';
import { UserModel } from '@/models/User.model';
import { RestaurantStatus, UserRole } from '@/types/domain.types';
import { hashPassword } from '@/utils/hash';
import { logger } from '@/utils/logger';

/**
 * One-time local-dev seed script. Populates the single demo restaurant the
 * frontend points at (RailBite currently has no station-selector UI, so the
 * whole app is wired to this one pre-approved kitchen) plus its menu, ported
 * 1:1 from the frontend's former static `data/foods.ts` catalog so the UI
 * renders identically once it switches to live data.
 *
 * Run with: npm run seed (from backend/)
 */

export const DEFAULT_STATION_CODE = 'NDLS';
const RESTAURANT_NAME = 'SRFOOD Kitchen';
const OWNER_EMAIL = 'owner@railbite.local';

interface SeedItem {
  name: string;
  description: string;
  pricePaise: number;
  veg: boolean;
}

const MENU_SEED: { category: string; items: SeedItem[] }[] = [
  {
    category: 'Veg Thali',
    items: [
      { name: 'Veg Thali', description: 'Dal, Paneer, Rice, 2 Roti, Mix Veg, Salad', pricePaise: 14900, veg: true },
      {
        name: 'Paneer Butter Masala',
        description: 'Paneer Butter Masala, Rice, 2 Roti, Salad',
        pricePaise: 15900,
        veg: true,
      },
    ],
  },
  {
    category: 'Non-Veg Thali',
    items: [
      {
        name: 'Chicken Curry Thali',
        description: 'Chicken Curry, Rice, 2 Roti, Dal, Salad',
        pricePaise: 17900,
        veg: false,
      },
    ],
  },
  {
    category: 'Biryani',
    items: [
      { name: 'Veg Biryani', description: 'Veg Biryani with Raita & Salad', pricePaise: 12900, veg: true },
      { name: 'Chicken Biryani', description: 'Chicken Biryani with Raita & Salad', pricePaise: 16900, veg: false },
    ],
  },
  {
    category: 'Snacks',
    items: [
      { name: 'Crispy Samosa (2 pcs)', description: 'Golden samosas with mint chutney', pricePaise: 4900, veg: true },
    ],
  },
  {
    category: 'Beverages',
    items: [{ name: 'Rose Lassi', description: 'Chilled rose-flavored yogurt drink', pricePaise: 5900, veg: true }],
  },
  {
    category: 'Combos',
    items: [
      { name: 'Deluxe Veg Combo', description: 'Rice, 2 curries, 2 roti, dessert', pricePaise: 19900, veg: true },
    ],
  },
  {
    category: 'Desserts',
    items: [
      {
        name: 'Gulab Jamun (3 pcs)',
        description: 'Warm syrup-soaked milk dumplings',
        pricePaise: 6900,
        veg: true,
      },
    ],
  },
];

async function seed(): Promise<void> {
  await connectDatabase();

  let owner = await UserModel.findOne({ email: OWNER_EMAIL });
  if (!owner) {
    owner = await UserModel.create({
      name: 'RailBite Kitchen Partner',
      mobile: '9000000001',
      email: OWNER_EMAIL,
      passwordHash: await hashPassword('Owner@12345'),
      role: UserRole.RESTAURANT_MANAGER,
      isEmailVerified: true,
      isMobileVerified: true,
      isActive: true,
    });
    logger.info('Seed: created restaurant owner user', { id: owner.id, email: OWNER_EMAIL });
  } else {
    logger.info('Seed: owner user already exists', { id: owner.id });
  }

  let restaurant = await RestaurantModel.findOne({ name: RESTAURANT_NAME });
  if (!restaurant) {
    restaurant = await RestaurantModel.create({
      name: RESTAURANT_NAME,
      ownerUserId: owner._id,
      fssaiLicenseNumber: '12345678901234',
      fssaiExpiryDate: new Date('2030-01-01'),
      gstin: '07AAAAA0000A1Z5',
      bankDetails: {
        accountHolderName: RESTAURANT_NAME,
        accountNumber: '123456789012',
        ifscCode: 'HDFC0000123',
      },
      address: {
        line1: 'Platform Road',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
      stationCodes: [DEFAULT_STATION_CODE],
      cuisineTypes: ['North Indian', 'Biryani', 'Desserts'],
      isVegOnly: false,
      minOrderValuePaise: 0,
      deliveryFeePaise: 2900,
      isCodEnabled: true,
      workingHours: [],
      status: RestaurantStatus.APPROVED,
      isActive: true,
      averageRating: 4.5,
      ratingCount: 128,
    });
    logger.info('Seed: created restaurant', { id: restaurant.id, stationCode: DEFAULT_STATION_CODE });
  } else {
    logger.info('Seed: restaurant already exists, skipping creation', { id: restaurant.id });
  }

  const existingMenuCount = await MenuModel.countDocuments({ restaurantId: restaurant._id });
  if (existingMenuCount > 0) {
    logger.info('Seed: menu already seeded, skipping', { categories: existingMenuCount });
  } else {
    let displayOrder = 0;
    for (const category of MENU_SEED) {
      await MenuModel.create({
        restaurantId: restaurant._id,
        categoryName: category.category,
        displayOrder: displayOrder++,
        isAvailable: true,
        items: category.items.map((item) => ({
          name: item.name,
          description: item.description,
          pricePaise: item.pricePaise,
          dietaryTag: item.veg ? 'veg' : 'non_veg',
          preparationTimeMinutes: 20,
          isAvailable: true,
        })),
      });
    }
    logger.info('Seed: menu categories and items created', { categories: MENU_SEED.length });
  }

  logger.info('Seed complete.', { restaurantId: restaurant.id, stationCode: DEFAULT_STATION_CODE });
  await disconnectDatabase();
}

seed().catch((error: unknown) => {
  logger.error('Seed failed', { error: error instanceof Error ? error.message : error });
  process.exit(1);
});
