import { baseApi } from "../../services/api";

export interface Card {
    id: number;
    title: string;
    description?: string;
    time_limit?: string;
    priority?: number;
    column_id: number;
    is_completed?: boolean;
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
    is_completed?: boolean;
}

export interface CardUpdate {
    id: number;
    title?: string;
    description?: string;
    time_limit?: string;
    priority?: number;
    column_id?: number;
    is_completed?: boolean;
}

export interface CardImageResponse {
    id: number;
    image_url: string;
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
        }),
        getCardImages: builder.query<CardImageResponse[], number>({
            query: (cardId) => `/cards/${cardId}/images/get`,
            providesTags: (_result, _error, cardId) => [{ type: "CardImage", id: cardId }] as any
        }),
        uploadCardImage: builder.mutation<CardImageResponse, { card_id: number; file: File }>({
            query: ({ card_id, file }) => {
                const formData = new FormData();
                formData.append("file", file);
                return {
                    url: `/cards/${card_id}/images/upload`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: (_result, _error, { card_id }) => [{ type: "CardImage", id: card_id }] as any
        }),
        deleteCardImage: builder.mutation<CardImageResponse, { card_image_id: number; card_id: number }>({
            query: ({ card_image_id }) => ({
                url: `/cards/images/delete/${card_image_id}`,
                method: "DELETE"
            }),
            invalidatesTags: (_result, _error, { card_id }) => [{ type: "CardImage", id: card_id }] as any
        }),
    })
});

export const { 
    useGetCardsQuery, 
    useCreateCardMutation, 
    useUpdateCardMutation, 
    useDeleteCardMutation,
    useGetCardImagesQuery,
    useUploadCardImageMutation,
    useDeleteCardImageMutation
} = cardsApi;
