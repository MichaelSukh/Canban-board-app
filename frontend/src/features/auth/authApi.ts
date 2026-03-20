import { baseApi } from "../../services/api";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ access_token: string; token_type: string }, URLSearchParams>({
            query: (credentials) => ({
                url: "/users/login",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
        }),

        register: builder.mutation<any, any>({
            query: (userData) => ({
                url: "/users/create",
                method: "POST",
                body: userData
            })
        })
    })
});

export const { useLoginMutation, useRegisterMutation } = authApi;