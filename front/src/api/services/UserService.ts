import axios, { AxiosError } from 'axios';
import { User } from '@/types/User';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RejectOptions, RequestTokenResponse, SignupResponse, UsernameCheckResponse } from '@/types/api-services/user/responses';
import { LoginRequest, RecoveryRequest, SignupRequest, UsernameCheckRequest } from '@/types/api-services/user/requests';
import { SERVER_API_URI } from '..';

const api = axios.create({
	baseURL: SERVER_API_URI,
	headers: {
		'ngrok-skip-browser-warning': 'true',
	},
});

const Points = {
	Base: 'users',
	Login: 'users/login',
	UserNameCheck: 'users/username-check',
	Logout: 'users/logout',
	Recovery: 'users/recovery',
	Qr: 'users/qr',
	PublicKey: 'users/public-key',
	GlobalKey: 'users/global-key',
	RequestToken: 'users/request-token',
} as const;

export const UserService = {
	signup: createAsyncThunk<SignupResponse, SignupRequest, RejectOptions>('/signUp', async ({ username, publicKey }, { rejectWithValue }) => {
		try {
			const res = await api.post(Points.Base, { username, clientPublicKey: publicKey });
			return res.data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error.message);
				return rejectWithValue(error?.response?.data?.message || error.message);
			}
			return rejectWithValue('Unexpected signup error');
		}
	}),

	usernameCheck: createAsyncThunk<UsernameCheckResponse, UsernameCheckRequest, RejectOptions>(Points.UserNameCheck, async (UserDto, { rejectWithValue }) => {
		try {
			const res = await api.post(Points.UserNameCheck, UserDto);
			return res.data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error);
				return rejectWithValue(error?.response?.data?.message || error.message);
			}
			return rejectWithValue('Unexpected loginCheck error');
		}
	}),

	getUser: createAsyncThunk<User, void, RejectOptions>('/get-user', async (_, { rejectWithValue }) => {
		try {
			const res = await api.get<User>(Points.Base);
			return res.data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error.message);
				return rejectWithValue(error?.response?.data?.message || error.message);
			}
			return rejectWithValue('Unexpected authCheck error');
		}
	}),

	login: createAsyncThunk<User, LoginRequest, RejectOptions>(Points.Login, async (loginDto, { rejectWithValue }) => {
		try {
			const res = await api.post<User>(Points.Login, loginDto);
			return res.data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error.message);
				return rejectWithValue(error?.response?.data?.message || error.message);
			}
			return rejectWithValue('Unexpected login error');
		}
	}),

	logout: createAsyncThunk<void, void, RejectOptions>(Points.Logout, async (_, { rejectWithValue }) => {
		try {
			await api.get(Points.Logout);
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error.message);
				return rejectWithValue(error?.response?.data?.message || error.message);
			}
			return rejectWithValue('Unexpected logout error');
		}
	}),

	recovery: createAsyncThunk<User, RecoveryRequest, RejectOptions>(Points.Recovery, async (recoveryDto, { rejectWithValue }) => {
		try {
			const res = await api.post<User>(Points.Recovery, recoveryDto);
			return res.data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error.message);
				return rejectWithValue(error?.response?.data?.message || error.message);
			}
			return rejectWithValue('Unexpected login error');
		}
	}),

	getQr: async (): Promise<File> => {
		try {
			const res = await api.get(Points.Qr);
			return res.data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error.message);
				throw new Error('Error getting qr img');
			}
			throw new Error('Unexpected get qr error');
		}
	},

	getPublicKey: async (): Promise<string> => {
		try {
			const res = await api.get(Points.PublicKey);
			return res.data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error.message);
				throw new Error('Error getting qr img');
			}
			throw new Error('Unexpected get public key error');
		}
	},

	getToken: async (clientPublicKey: string): Promise<RequestTokenResponse> => {
		try {
			const res = await api.post<RequestTokenResponse>(Points.RequestToken, { clientPublicKey });
			return res.data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				console.log(error.message);
				throw new Error('Error getting token img');
			}
			throw new Error('Unexpected get token error');
		}
	},
};
