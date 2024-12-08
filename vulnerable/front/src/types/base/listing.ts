import { GridColDef, GridSortModel } from "@mui/x-data-grid";
import { SetURLSearchParams } from "react-router-dom";

export enum SortOrder {
  "ASC" = "asc",
  "DESC" = "desc",
}

export enum FilterOp {
  "CONTAINS" = "contains",
  "IS" = "is",
  "NOT" = "not",
  "EQUALS" = "equals",
  "STARTS_WITH" = "startsWith",
  "ENDS_WITH" = "endsWith",
  "IS_ANY_OF" = "isAnyOf",
  "IS_EMPTY" = "isEmpty",
  "IS_NOT_EMPTY" = "isNotEmpty",
  "AFTER" = "after",
  "ON_OR_AFTER" = "onOrAfter",
  "BEFORE" = "before",
  "ON_OR_BEFORE" = "onOrBefore",
}

export interface BasePaginationParams {
  sortField?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  search?: string;
  filterField?: string;
  filterOp?: FilterOp;
  filter?: string;
}

export interface PaginatedList<resultsType = unknown>
  extends BasePaginationParams {
  currentResults: number;
  totalResults: number;
  results: resultsType[];
}

export type PaginationProps = {
  page: number;
  limit: number;
  totalResults: number | undefined;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  handlePageChange: (newPage: number) => void;
};

export interface ListGridProps<Row> {
  columns: GridColDef[];
  rows: Row[];
  loading: boolean;
  defaultSort: {
    field: string;
    order: "asc" | "desc";
    sortModelChangeHandler?: (model: GridSortModel) => void;
  };
  pagination?: PaginationProps;
  remarkableEventRowId?: string;
}
