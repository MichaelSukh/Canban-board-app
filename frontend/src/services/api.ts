import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";

const BASE_URL = "http://localhost:8000/";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: ["User", "Board", "Column", "Card"],
    endpoints: () => ({})
});