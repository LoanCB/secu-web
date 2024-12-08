import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';

enum FilesSortableField {
  ID = 'id',
  CREATED_DATE_FIELD = 'createdAt',
  UPDATED_DATE_FIELD = 'updatedAt',
  FILE_NAME = 'fileName',
  SIZE = 'size',
}

export class FilesListDto extends OmitType(PaginationParamsDto, ['sortField']) {
  @ApiPropertyOptional({
    example: FilesSortableField.CREATED_DATE_FIELD,
    description: 'Name of the column to sort on',
    default: FilesSortableField.CREATED_DATE_FIELD,
    enum: FilesSortableField,
  })
  @IsEnum(FilesSortableField, {
    message: `Unknown sort field. Allowed values : ${Object.values(FilesSortableField).join(' | ')}`,
  })
  @IsOptional()
  sortField: FilesSortableField = FilesSortableField.CREATED_DATE_FIELD;

  @ApiPropertyOptional({ description: 'Get with archived files', default: true })
  @IsBoolean()
  @IsOptional()
  withDeleted?: boolean = true;
}
