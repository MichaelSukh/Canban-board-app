import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("token") || null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ access_token: string }>) => {
            state.token = action.payload.access_token;
            localStorage.setItem("token", action.payload.access_token);
        },

        logout: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
