import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';

enum TicketsSortableField {
  ID = 'id',
  CREATED_DATE_FIELD = 'createdAt',
  UPDATED_DATE_FIELD = 'updatedAt',
  ARCHIVED_DATE_FIELD = 'deletedAt',
  TITLE = 'TITLE',
}

export class UsersListDto extends OmitType(PaginationParamsDto, ['sortField']) {
  @ApiPropertyOptional({
    example: TicketsSortableField.CREATED_DATE_FIELD,
    description: 'Name of the column to sort on',
    default: TicketsSortableField.CREATED_DATE_FIELD,
    enum: TicketsSortableField,
  })
  @IsEnum(TicketsSortableField, {
    message: `Unknown sort field. Allowed values : ${Object.values(TicketsSortableField).join(' | ')}`,
  })
  @IsOptional()
  sortField: TicketsSortableField = TicketsSortableField.CREATED_DATE_FIELD;
}
