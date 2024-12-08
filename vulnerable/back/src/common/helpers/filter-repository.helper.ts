import {
  Equal,
  FindOperator,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  ObjectLiteral,
  Raw,
  SelectQueryBuilder,
} from 'typeorm';
import { EntityFilteredListOptions, ProcessedParams, RelationParam } from '../types/filter-repository.types';
import { PaginationParamsDto } from '../dto/pagination-params.dto';
import { FilterOp, SortOrder } from '../types/pagination-params.types';
import { ConfigService } from '@nestjs/config';
import configurationConfig from 'src/config/configuration.config';
import * as dayjs from 'dayjs';

/**
 * --------------------------------------------------
 * IMPORTANT : THIS CODE WROTE FOR MARIADB DATABASE !
 * --------------------------------------------------
 */

/**
 * Check if string is a valid date and convert into it if possible or return the string
 */
const sanitizer = (value: string): string | dayjs.Dayjs => {
  const date = dayjs(value);
  return date.isValid() && value.match(/^\d{4}-\d{2}-\d{2}.*/i) ? date.format('YYYY-MM-DD') : value;
};

/**
 * Convert semi-colon separated value into an array if not already and apply the sanitizer on each values
 */
const sanitizeQueryFilterValues = (filterValues: string | string[]): (string | dayjs.Dayjs)[] => {
  if (!Array.isArray(filterValues)) {
    // Remove parenthesis and split by semi-colon
    filterValues = filterValues.slice(1, -1).split(';');
  }

  return filterValues.map((filterVal) => sanitizer(filterVal));
};

/**
 * Build the query filter to use on a QueryBuilder.where
 */
export const sqlBuildQueryFilter = (paginationParams: PaginationParamsDto, isAndCondition = false) => {
  const { filterField, filterOp, filter } = paginationParams;

  // Early return if one parameter is missing
  if (!filterField || !filterOp || (filterOp !== FilterOp.IS_EMPTY && filterOp !== FilterOp.IS_NOT_EMPTY && !filter)) {
    return [];
  }

  const orFilter = [];
  const andFilter: { [key: string]: FindOperator<any> } = {};
  const processedParams: ProcessedParams = {
    filterField: filterField.split(','),
    filterOp: filterOp.split(','),
    filter: !!filter ? filter.split(',') : [''], // TODO fix this in the length verification instead of here (empty doesn't need filter value)
  };

  if (processedParams.filterField.length) {
    if (
      ![processedParams.filterOp, processedParams.filter].every(
        ({ length }) => length === processedParams.filterField.length,
      )
    ) {
      throw new Error('Params "filterField", "filterOp" and "filter" must have the same length');
    }

    const separator = ';';
    const regexString = `^\\(([^${separator}]+)(?:${separator}([^${separator}]+))*\\)$`;
    const regex = new RegExp(regexString);

    for (let i = 0; i < processedParams.filterField.length; i++) {
      const field = processedParams.filterField[i];
      const operator = processedParams.filterOp[i];
      const value = processedParams.filter[i];

      if (operator === FilterOp.IS_ANY_OF && !regex.test(value)) {
        throw new Error(
          `Incompatible value ${value}. Example of correct filter : (value1${separator}value2${separator}value3)`,
        );
      }

      const sanitizedValue = sanitizer(value);
      const response: { [key: string]: FindOperator<any> } = {};

      switch (operator) {
        case 'contains':
        default:
          response[field] = Raw((alias) => `CAST(${alias} as char) LIKE '%${sanitizedValue}%'`);
          break;
        case 'not':
          response[field] = Not(sanitizedValue);
          break;
        case 'equals':
        case 'is':
          response[field] = Equal(sanitizedValue);
          break;
        case 'startsWith':
          response[field] = Raw((alias) => `CAST(${alias} as char) LIKE '${sanitizedValue}%'`);
          break;
        case 'endsWith':
          response[field] = Raw((alias) => `CAST(${alias} as char) LIKE '%${sanitizedValue}'`);
          break;
        case 'isEmpty':
          response[field] = Raw((alias) => `CAST(${alias} as char) LIKE ''`);
          break;
        case 'isNotEmpty':
          response[field] = Not(Raw((alias) => `CAST(${alias} as char) LIKE ''`));
          break;
        case 'after':
          response[field] = MoreThan(sanitizedValue);
          break;
        case 'before':
          response[field] = LessThan(sanitizedValue);
          break;
        case 'onOrAfter':
          response[field] = MoreThanOrEqual(sanitizedValue);
          break;
        case 'onOrBefore':
          response[field] = LessThanOrEqual(sanitizedValue);
          break;
        case 'isAnyOf':
          // Special treatment for split values
          response[field] = In(sanitizeQueryFilterValues(value));
          break;
      }

      if (isAndCondition) {
        andFilter[field] = response[field];
      } else {
        orFilter.push(response);
      }
    }
  } else {
    return [];
  }

  return isAndCondition ? andFilter : orFilter;
};

/**
 * Build the search filter array to use on a QueryBuilder.where
 */
export const sqlBuildSearchFilter = (searchValue: string, fields: string[]) => {
  const searchFilter = [];
  for (const field of fields) {
    searchFilter.push({
      [field]: Raw((alias) => `CAST(${alias} as char) LIKE '%${searchValue}%'`),
    });
  }
  return searchFilter;
};

/**
 * Recursive function to add on query the left join in order to load nested relations
 */
const loadLeftJoinAndSelect = <Entity extends ObjectLiteral>(
  query: SelectQueryBuilder<Entity>,
  alias: string,
  relationParam: RelationParam,
) => {
  // Apply left join on query
  query.leftJoinAndSelect(`${alias}.${relationParam.relation}`, relationParam.alias);

  // Recursive call on joins if defined
  if (relationParam.joins && relationParam.joins.length) {
    for (const childRelation of relationParam.joins) {
      loadLeftJoinAndSelect(query, relationParam.alias, childRelation);
    }
  }
};

export const getEntityFilteredList = async <Entity extends ObjectLiteral>(
  options: EntityFilteredListOptions<Entity>,
): Promise<[Entity[], number]> => {
  const { search } = options.queryFilter;
  const searchFilter = search && options.searchFields ? sqlBuildSearchFilter(search, options.searchFields) : [];
  const multipleFilter = sqlBuildQueryFilter(options.queryFilter, options.isAndCondition ?? true);

  const alias = 'e';
  const pk = options.pkName ?? 'id';

  const configService = new ConfigService(configurationConfig());
  const paginationOptions = {
    limit: options.queryFilter.limit ?? configService.get('defaultPaginationLimit') ?? 15,
    page: options.queryFilter.page ?? 1,
  };
  if (paginationOptions.limit > 100) {
    paginationOptions.limit = 100;
  }

  const offset = paginationOptions.limit * paginationOptions.page - paginationOptions.limit;

  const rootQuery = options.repository
    .createQueryBuilder(alias)
    .where(searchFilter)
    .andWhere(multipleFilter)
    .limit(paginationOptions.limit)
    .offset(offset);
  if (options.withDeleted) {
    rootQuery.withDeleted();
  }

  if (options.relations?.length) {
    rootQuery.select(`${alias}.${pk}`);
    const [resultsIds, totalResults] = await rootQuery.getManyAndCount();

    if (!totalResults) {
      return [[], 0];
    }

    const finalQuery = options.repository
      .createQueryBuilder(alias)
      .withDeleted()
      .where(`${alias}.${pk} in (:...ids)`, { ids: resultsIds.map((obj) => obj[pk]) })
      .orderBy(
        `${alias}.${options.queryFilter.sortField ?? pk}`,
        options.queryFilter.sortOrder === SortOrder.DESC ? 'DESC' : 'ASC',
      );

    if (options.withDeleted) {
      finalQuery.withDeleted();
    }

    for (const relationParam of options.relations) {
      loadLeftJoinAndSelect(finalQuery, alias, relationParam);
    }
    const results = await finalQuery.getMany();

    return [results, totalResults];
  } else {
    const [results, totalResults] = await rootQuery
      .orderBy(
        `${alias}.${options.queryFilter.sortField ?? pk}`,
        options.queryFilter.sortOrder === SortOrder.DESC ? 'DESC' : 'ASC',
      )
      .getManyAndCount();

    return [results, totalResults];
  }
};
