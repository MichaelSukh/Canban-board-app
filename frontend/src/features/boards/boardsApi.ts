import { baseApi } from "../../services/api";

export interface Board {
    id: number;
    title: string;
    description?: string;
    owner_id: number;
    columns_count?: number;
}

export interface BoardListResponse {
    boards: Board[];
    total_boards: number;
}

export interface BoardUpdate {
    id: number;
    title: string;
    description?: string;
}

export interface BoardCreate {
    title: string;
    description?: string;
}

export const boardsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBoards: builder.query<BoardListResponse, void>({
            query: () => ({
                url: "boards",
                method: "GET"
            }),
            providesTags: ["Board"]
        }),
        updateBoard: builder.mutation<Board, BoardUpdate>({
            query: (boardData) => ({
                url: `boards/update/${boardData.id}`,
                method: "PUT",
                body: boardData
            }),
            invalidatesTags: ["Board"]
        }),
        createBoard: builder.mutation<Board, BoardCreate>({
            query: (boardData) => ({
                url: "boards/create",
                method: "POST",
                body: boardData
            }),
            invalidatesTags: ["Board"]
        }),
        deleteBoard: builder.mutation<Board, number>({
            query: (id) => ({
                url: `boards/delete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Board"]
        })
    })
});

export const { useGetBoardsQuery, useCreateBoardMutation, useUpdateBoardMutation, useDeleteBoardMutation } = boardsApi;
