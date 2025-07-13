import { PaginationDto } from '../dto/pagination.dto';
/**
 * Simple utility to calculate pagination parameters
 */
export function getPaginationParams(paginationDto: PaginationDto) {
  const page = paginationDto.page || 1;
  const limit = paginationDto.limit || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}