import { BasePaginationParams, PaginatedList } from "@src/types/base/listing";
import { Counter } from "@src/types/ticketing/counter";
import { Ticket } from "@src/types/ticketing/ticket";
import { api } from "./api";

export const ticketingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCounters: builder.query<Counter, void>({
      query: () => "tickets/count",
      providesTags: ["tickets", "files"],
    }),
    getTickets: builder.query<PaginatedList<Ticket>, BasePaginationParams>({
      query: () => "tickets",
      providesTags: ["tickets"],
    }),
    getTicketDetails: builder.query<Ticket, number>({
      query: (id) => `tickets/${id}`,
    }),
  }),
});

export const {
  useGetCountersQuery,
  useGetTicketsQuery,
  useGetTicketDetailsQuery,
} = ticketingApi;
