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

export const cardsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCards: builder.query<CardListResponse, number>({
            query: (columnId) => `/cards/${columnId}`,
            providesTags: ["Card"] as any
        }),
    })
});

export const { useGetCardsQuery } = cardsApi;
