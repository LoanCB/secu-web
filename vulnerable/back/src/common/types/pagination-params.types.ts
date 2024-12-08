export enum SortOrder {
  'ASC' = 'asc',
  'DESC' = 'desc',
}

export enum DefaultSortableFields {
  ID = 'id',
  CREATED_DATE_FIELD = 'createdAt',
  UPDATED_DATE_FIELD = 'updatedAt',
}

export enum FilterOp {
  'CONTAINS' = 'contains',
  'IS' = 'is',
  'NOT' = 'not',
  'EQUALS' = 'equals',
  'STARTS_WITH' = 'startsWith',
  'ENDS_WITH' = 'endsWith',
  'IS_ANY_OF' = 'isAnyOf',
  'IS_EMPTY' = 'isEmpty',
  'IS_NOT_EMPTY' = 'isNotEmpty',
  'AFTER' = 'after',
  'ON_OR_AFTER' = 'onOrAfter',
  'BEFORE' = 'before',
  'ON_OR_BEFORE' = 'onOrBefore',
}

interface BasePaginationParams {
  sortField?: string;
  sortOrder?: SortOrder;
  offset?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedList<resultsType = any> extends BasePaginationParams {
  currentResults: number;
  totalResults: number;
  results: resultsType[];
}
