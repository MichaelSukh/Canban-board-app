import { baseApi } from "../../services/api";

export interface Card {
    id: number;
    title: string;
    description?: string;
    time_limit?: string;
    priority?: number;
    column_id: number;
}

export interface CardListResponse {
    cards: Card[];
    total_cards: number;
}

export interface CardCreate {
    column_id: number;
    title: string;
    description?: string;
    time_limit?: string;
    priority?: number;
}

export interface CardUpdate {
    id: number;
    title?: string;
    description?: string;
    time_limit?: string;
    priority?: number;
    column_id?: number;
}

export const cardsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCards: builder.query<CardListResponse, number>({
            query: (columnId) => `/cards/${columnId}`,
            providesTags: ["Card"] as any
        }),
        createCard: builder.mutation<Card, CardCreate>({
            query: ({ column_id, ...cardData }) => ({
                url: `/cards/create/${column_id}`,
                method: "POST",
                body: cardData
            }),
            invalidatesTags: ["Card"] as any
        }),
        updateCard: builder.mutation<Card, CardUpdate>({
            query: ({ id, ...cardData }) => ({
                url: `/cards/update/${id}`,
                method: "PUT",
                body: cardData
            }),
            invalidatesTags: ["Card"] as any
        }),
        deleteCard: builder.mutation<Card, number>({
            query: (cardId) => ({
                url: `/cards/delete/${cardId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Card"] as any
        })
    })
});

export const { 
    useGetCardsQuery, 
    useCreateCardMutation, 
    useUpdateCardMutation, 
    useDeleteCardMutation 
} = cardsApi;
