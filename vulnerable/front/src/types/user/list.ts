import { BasePaginationParams } from "../base/listing";

export interface UserPaginationParams extends BasePaginationParams {
  withArchived?: boolean;
}

export enum UsersSortableField {
  ID = "id",
  CREATED_DATE_FIELD = "createdAt",
  UPDATED_DATE_FIELD = "updatedAt",
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  IS_ACTIVE = "isActive",
  ARCHIVED_DATE_FIELD = "archivedAt",
}

export interface ArchiveUserDto {
  id: number;
  isActive: boolean;
}
