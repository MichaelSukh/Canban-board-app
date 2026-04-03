import { baseApi } from "../../services/api";

export interface Column {
    id: number;
    title: string;
    board_id: number;
}

export interface ColumnListResponse {
    columns: Column[];
    total_columns: number;
}

export interface ColumnUpdate {
    id: number;
    title: string;
}

export interface ColumnCreate {
    board_id: number;
    title: string;
}

export const columnsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getColumns: builder.query<ColumnListResponse, number>({
            query: (boardId) => `/columns/${boardId}`,
            providesTags: ["Column"] as any
        }),
        createColumn: builder.mutation<Column, ColumnCreate>({
            query: ({ board_id, ...columnData }) => ({
                url: `/columns/create/${board_id}`,
                method: "POST",
                body: columnData
            }),
            invalidatesTags: ["Column"] as any
        }),
        updateColumn: builder.mutation<Column, ColumnUpdate>({
            query: ({ id, ...columnData }) => ({
                url: `/columns/update/${id}`,
                method: "PUT",
                body: columnData
            }),
            invalidatesTags: ["Column"] as any
        }),
        deleteColumn: builder.mutation<Column, number>({
            query: (columnId) => ({
                url: `/columns/delete/${columnId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Column"] as any
        }),
    })
});

export const {
    useGetColumnsQuery,
    useCreateColumnMutation,
    useUpdateColumnMutation,
    useDeleteColumnMutation
} = columnsApi;
