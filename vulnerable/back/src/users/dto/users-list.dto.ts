import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { IsEnum, IsOptional } from 'class-validator';

enum UsersSortableField {
  ID = 'id',
  CREATED_DATE_FIELD = 'createdAt',
  UPDATED_DATE_FIELD = 'updatedAt',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  IS_ACTIVE = 'isActive',
  ARCHIVED_DATE_FIELD = 'archivedAt',
}

export class UsersListDto extends OmitType(PaginationParamsDto, ['sortField']) {
  @ApiPropertyOptional({
    example: UsersSortableField.CREATED_DATE_FIELD,
    description: 'Name of the column to sort on',
    default: UsersSortableField.CREATED_DATE_FIELD,
    enum: UsersSortableField,
  })
  @IsEnum(UsersSortableField, {
    message: `Unknown sort field. Allowed values : ${Object.values(UsersSortableField).join(' | ')}`,
  })
  @IsOptional()
  sortField: UsersSortableField = UsersSortableField.CREATED_DATE_FIELD;
}
