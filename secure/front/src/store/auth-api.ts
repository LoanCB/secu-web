import { UserFormData } from "@src/components/base/users-list";
import { PaginatedList } from "@src/types/base/listing";
import { ArchiveUserDto, UserPaginationParams } from "@src/types/user/list";
import { LoggedUser, UserDto } from "../types/user/user";
import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ access_token: string }, UserDto>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<LoggedUser, string>({
      query: (token) => ({
        url: "auth/profile",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    usersList: builder.query<PaginatedList<LoggedUser>, UserPaginationParams>({
      query: () => "users",
      providesTags: ["users"],
    }),
    createUser: builder.mutation<void, UserFormData>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["users"],
    }),
    updateUser: builder.mutation<void, UserFormData>({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["users"],
    }),
    archiveUser: builder.mutation<void, ArchiveUserDto>({
      query: ({ id, isActive }) => ({
        url: `users/${id}/archive`,
        body: { isActive },
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLazyGetProfileQuery,
  useUsersListQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useArchiveUserMutation,
} = authApi;
