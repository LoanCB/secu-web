import { Counter } from "@src/types/ticketing/counter";
import { api } from "./api";

export const ticketingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCounters: builder.query<Counter, void>({
      query: () => "tickets/count",
      providesTags: ["tickets", "files"],
    }),
  }),
});

export const { useGetCountersQuery } = ticketingApi;
