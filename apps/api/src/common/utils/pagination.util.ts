import { PaginationQueryDTO } from '../dto/pagination.dto';
/**
 * Simple utility to calculate pagination parameters
 */
export function getPaginationParams(paginationQueryDto: PaginationQueryDTO) {
  const page = paginationQueryDto.page || 1;
  const limit = paginationQueryDto.limit || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}