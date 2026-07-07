import type { IMenu } from '@/models/Menu.model';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the menus module (TRD 3.2.4, 5.3, `menus` collection).
 * Scaffold: category/item CRUD persistence is planned for a later phase.
 */
export class MenusRepository {
  findById(id: string): Promise<IMenu | null> {
    throw new NotImplementedError(`MenusRepository.findById(${id}) is not yet implemented.`);
  }

  findByRestaurantId(restaurantId: string): Promise<IMenu[]> {
    throw new NotImplementedError(
      `MenusRepository.findByRestaurantId(${restaurantId}) is not yet implemented.`,
    );
  }

  create(data: Partial<IMenu>): Promise<IMenu> {
    throw new NotImplementedError(`MenusRepository.create(${JSON.stringify(data)}) is not yet implemented.`);
  }

  updateById(id: string, data: Partial<IMenu>): Promise<IMenu | null> {
    throw new NotImplementedError(
      `MenusRepository.updateById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }

  softDeleteById(id: string): Promise<IMenu | null> {
    throw new NotImplementedError(`MenusRepository.softDeleteById(${id}) is not yet implemented.`);
  }
}
