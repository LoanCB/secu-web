import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DefaultSortableFields, FilterOp, SortOrder } from '../types/pagination-params.types';

@ValidatorConstraint({ name: 'IsValidFilterOpArray', async: false })
class IsValidFilterOpArray implements ValidatorConstraintInterface {
  validate(values: string): boolean {
    const filterOpValues = Object.values(FilterOp);
    const valueArray = values.split(',');
    return valueArray.every((value) => filterOpValues.includes(value as FilterOp));
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const allowedValues = Object.values(FilterOp).join(' | ');

    if (validationArguments) {
      return `${validationArguments.property} contains invalid values. Allowed values: ${allowedValues}}`;
    }

    return `Invalid values passed. Allowed values : ${allowedValues}`;
  }
}

export class PaginationParamsDto {
  @ApiPropertyOptional({
    example: 0,
    description: 'Current page',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Max results per page to fetch',
    example: 10,
    default: 15,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sorting order',
    default: SortOrder.DESC,
    enum: SortOrder,
  })
  @IsEnum(SortOrder, {
    message: `Unknown sort order. Allowed values: ${Object.values(SortOrder).join(' | ')}`,
  })
  @IsOptional()
  sortOrder?: SortOrder;

  @ApiPropertyOptional({
    example: DefaultSortableFields.CREATED_DATE_FIELD,
    description: 'Sorting field',
  })
  @Transform((params) => {
    return params.value === 'description' ? null : params.value;
  })
  @IsEnum(DefaultSortableFields, {
    message: `Unknown sort field. Allowed values: ${Object.values(DefaultSortableFields).join(' | ')}`,
  })
  @IsOptional()
  sortField?: string;

  @ApiPropertyOptional({
    description: 'Search a value in multiple columns.<br>Example : John',
  })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to filter on.<br>Example: firstName',
  })
  @IsOptional()
  filterField?: string;

  @ApiPropertyOptional({
    description: 'Filter operator can be contains, equals...',
    enum: FilterOp,
  })
  @Validate(IsValidFilterOpArray, ['FilterOp'])
  @IsOptional()
  filterOp?: string;

  @ApiPropertyOptional({ description: 'Filter value.<br>Example : active' })
  @IsOptional()
  filter?: string;
}
