import type {
  ChangePasswordDto,
  ListUsersQueryDto,
  RequestMobileChangeDto,
  UpdateProfileDto,
  UpdateUserStatusDto,
} from '@/modules/users/users.dto';
import type { UsersRepository } from '@/modules/users/users.repository';
import type { UserProfileView } from '@/modules/users/users.types';
import type { IUser } from '@/models/User.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Business logic for profile management and admin user administration
 * (PRD 11.2, 11.20). Scaffold: business rules (mobile re-verification,
 * 30-day soft-delete recovery window, etc.) are planned for a later
 * phase — see TRD scope note in the module README.
 */
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  getProfile(userId: string): Promise<UserProfileView> {
    throw new NotImplementedError(`UsersService.getProfile(${userId}) is not yet implemented.`);
  }

  updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileView> {
    throw new NotImplementedError(
      `UsersService.updateProfile(${userId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }

  changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    throw new NotImplementedError(
      `UsersService.changePassword(${userId}, ***) is not yet implemented. Payload keys: ${Object.keys(dto).join(', ')}`,
    );
  }

  requestMobileChange(userId: string, dto: RequestMobileChangeDto): Promise<void> {
    throw new NotImplementedError(
      `UsersService.requestMobileChange(${userId}, ${dto.newMobile}) is not yet implemented.`,
    );
  }

  deleteAccount(userId: string): Promise<void> {
    throw new NotImplementedError(`UsersService.deleteAccount(${userId}) is not yet implemented.`);
  }

  listUsers(query: ListUsersQueryDto): Promise<PaginatedResult<IUser>> {
    throw new NotImplementedError(
      `UsersService.listUsers(${JSON.stringify(query)}) is not yet implemented.`,
    );
  }

  updateUserStatus(id: string, dto: UpdateUserStatusDto, adminUserId: string): Promise<IUser> {
    throw new NotImplementedError(
      `UsersService.updateUserStatus(${id}, isActive=${dto.isActive}, admin=${adminUserId}) is not yet implemented.`,
    );
  }
}
