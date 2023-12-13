// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { setAPIToken } from '@/pages/api';
import { decodeToken } from '@/utils/jwtUtils';

interface User {
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async thunk for login
export const loginAsync = createAsyncThunk('auth/login', async (credentials: { email: string, password: string }, { dispatch }) => {
    try {
        // Perform API call to get the token
        const response = await axios.post('/token', credentials);
        const { data } = response;

        // Save the token in local storage or cookies
        localStorage.setItem('token', data.access_token);

        // Dispatch the token to the Redux store
        dispatch(setToken(data.access_token));

        setAPIToken(data.access_token);
        return data.access_token;
    } catch (error) {
        // Handle error
        console.error('Login failed:', error);
        throw error;
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getAuth: (state) => {
            const jwt_token = localStorage.getItem('token');

            if (jwt_token) {
                const user: User = decodeToken(jwt_token);
                state.user = user;
                state.token = localStorage.getItem('token');
                state.isAuthenticated = true;
                return;
            }

            state.isAuthenticated = false;
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            setAPIToken(null);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 'Login failed';
            });
    },
});

// Actions
export const { setToken, logout, getAuth } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Reducer
export default authSlice.reducer;
