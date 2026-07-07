import type { IUser } from '@/models/User.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access layer for the users module (TRD 3.2.4, 5.3).
 * Scaffold: methods are typed but not yet implemented — full profile /
 * admin-listing query logic is planned for a later phase.
 */
export class UsersRepository {
  findById(id: string): Promise<IUser | null> {
    throw new NotImplementedError(`UsersRepository.findById(${id}) is not yet implemented.`);
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number): Promise<PaginatedResult<IUser>> {
    throw new NotImplementedError(
      `UsersRepository.findMany(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }

  updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    throw new NotImplementedError(
      `UsersRepository.updateById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }

  softDeleteById(id: string): Promise<IUser | null> {
    throw new NotImplementedError(`UsersRepository.softDeleteById(${id}) is not yet implemented.`);
  }
}
