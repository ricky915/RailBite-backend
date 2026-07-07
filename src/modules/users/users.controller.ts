import type { Request, Response } from 'express';

import type {
  ChangePasswordDto,
  ListUsersQueryDto,
  RequestMobileChangeDto,
  UpdateProfileDto,
  UpdateUserStatusDto,
  UserIdParamsDto,
} from '@/modules/users/users.dto';
import type { UsersService } from '@/modules/users/users.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

/**
 * Users module HTTP handlers (TRD 10.2). Thin: extract, delegate,
 * respond. Service methods are scaffolded to throw 501 for now.
 */
export class UsersController {
  constructor(private readonly service: UsersService) {}

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const profile = await this.service.getProfile(requireUserId(req));
    successResponse(res, profile, 'Profile retrieved successfully.');
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateProfileDto;
    const profile = await this.service.updateProfile(requireUserId(req), dto);
    successResponse(res, profile, 'Profile updated successfully.');
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as ChangePasswordDto;
    await this.service.changePassword(requireUserId(req), dto);
    successResponse(res, null, 'Password changed successfully.');
  };

  requestMobileChange = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as RequestMobileChangeDto;
    await this.service.requestMobileChange(requireUserId(req), dto);
    successResponse(res, null, 'OTP sent to the new mobile number for verification.');
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    await this.service.deleteAccount(requireUserId(req));
    successResponse(res, null, 'Account deletion initiated. You have 30 days to recover it.');
  };

  listUsers = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListUsersQueryDto;
    const result = await this.service.listUsers(query);
    successResponse(res, result, 'Users retrieved successfully.');
  };

  updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as UserIdParamsDto;
    const dto = req.body as UpdateUserStatusDto;
    const user = await this.service.updateUserStatus(id, dto, requireUserId(req));
    successResponse(res, user, 'User status updated successfully.');
  };
}
