import {
  Box,
  Container,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridSortDirection,
  GridSortModel,
} from "@mui/x-data-grid";
import { ListGridProps } from "@src/types/base/listing";

const ListGridComponent = <Row,>({
  columns,
  rows,
  loading,
  defaultSort,
  pagination,
}: ListGridProps<Row>) => {
  const { palette, breakpoints } = useTheme();
  const isExtraSmallDevice = useMediaQuery(breakpoints.down("sm"));
  const isSmallDevice = useMediaQuery(breakpoints.down("md"));

  const initialGridProps: DataGridProps = {
    getRowId: (row) => row.id,
    loading,
    rows,
    columns,
    columnHeaderHeight: 25,
    rowHeight: 40,
  };

  if (!pagination) {
    return <DataGrid {...initialGridProps} hideFooter />;
  }

  const {
    page,
    limit,
    totalResults,
    searchParams,
    setSearchParams,
    handlePageChange,
  } = pagination;

  const getPaginationSize = (): "small" | "medium" | "large" => {
    if (isExtraSmallDevice) {
      return "small";
    } else if (isSmallDevice) {
      return "medium";
    }
    return "medium";
  };

  const getDisplayRange = () => {
    const firstRow = (page - 1) * limit + 1;
    const lastRow = Math.min(limit * page, totalResults ?? 1);
    return (
      <Box sx={{ position: "absolute", right: 0, mr: 3 }}>
        <Typography
          color={palette.primary.main}
          fontWeight="bold"
          fontSize={14}
        >
          {`${firstRow} à ${lastRow} sur ${totalResults}`}
        </Typography>
      </Box>
    );
  };

  const handleSortModelChange = (model: GridSortModel) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (model.length) {
      const sortModel = model[0];
      newSearchParams.set("sortField", sortModel.field);
      newSearchParams.set(
        "sortOrder",
        sortModel.sort ? sortModel.sort : "desc"
      );
    } else {
      newSearchParams.set("sortField", "");
      newSearchParams.set("sortOrder", "");
    }
    setSearchParams(newSearchParams);
  };

  return (
    <>
      <DataGrid
        {...initialGridProps}
        rowCount={totalResults || 0}
        rowHeight={35}
        paginationModel={{ page: page - 1, pageSize: limit }}
        paginationMode="server"
        sortingMode="server"
        initialState={{
          sorting: {
            sortModel: [
              {
                field: searchParams.get("sortField") || defaultSort.field,
                sort:
                  (searchParams.get("sortOrder") as GridSortDirection) ||
                  defaultSort.order,
              },
            ],
          },
        }}
        onSortModelChange={handleSortModelChange}
        hideFooter
        disableColumnMenu
      />
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pagination
          showFirstButton
          showLastButton
          count={totalResults ? Math.ceil(totalResults / limit) : 1}
          page={page}
          size={getPaginationSize() || "medium"}
          color="primary"
          onChange={(_event, newPage) => handlePageChange(newPage)}
        />
        {getDisplayRange()}
      </Container>
    </>
  );
};

export default ListGridComponent;
