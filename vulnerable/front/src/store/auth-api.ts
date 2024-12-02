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
  }),
});

export const { useLoginUserMutation, useLazyGetProfileQuery } = authApi;
