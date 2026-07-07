/**
 * Response envelope types (TRD 10.6). Every API response — success or
 * error — conforms to one of these shapes.
 */

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SuccessResponseBody<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string;
  errors?: FieldError[];
}

export type ApiResponseBody<T> = SuccessResponseBody<T> | ErrorResponseBody;
