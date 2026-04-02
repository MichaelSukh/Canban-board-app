import { baseApi } from "../../services/api";

export interface UserUpdate {
    username?: string;
    user_icon?: string;
    password?: string;
}

export interface UserResponse {
    id: number;
    email: string;
    username: string;
    user_icon: string | null;
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<UserResponse, void>({
            query: () => '/users/me',
            providesTags: ['User']
        }),
        updateUser: builder.mutation<UserResponse, UserUpdate>({
            query: (userData) => ({
                url: '/users/update',
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: ['User']
        }),
        uploadAvatar: builder.mutation<UserResponse, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);
                return {
                    url: '/users/avatar',
                    method: 'POST',
                    body: formData,
                }
            },
            invalidatesTags: ['User']
        })
    })
});

export const { useGetMeQuery, useUpdateUserMutation, useUploadAvatarMutation } = userApi;
