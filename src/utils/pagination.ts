import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/config/constants';
import type { PaginationMeta } from '@/types/api.types';

export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
  limit: number;
}

/**
 * Computes skip/limit from raw page/pageSize query values, clamping to
 * platform-wide defaults (TRD 11.3, 26): page=1, pageSize=20, max=100.
 */
export function paginate(rawPage?: number | string, rawPageSize?: number | string): PaginationParams {
  const page = Math.max(1, Number(rawPage) || DEFAULT_PAGE);
  const requestedPageSize = Number(rawPageSize) || DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(Math.max(1, requestedPageSize), MAX_PAGE_SIZE);
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip, limit: pageSize };
}

/**
 * Builds the `meta` block for a paginated success response.
 */
export function buildPaginationMeta(page: number, pageSize: number, total: number): PaginationMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
