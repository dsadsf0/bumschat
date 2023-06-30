import axios, { AxiosError } from "axios";
import { API_URL } from './../index';
import { ISignupResponse } from "@/types/api-services/UserService";

const api = axios.create({
    baseURL: API_URL + '/auth'
});

const Points = {
    signup: '/signup'
}

export const UserService = {
    signup: async (username: string): Promise<ISignupResponse | string> => {
        try {
            const res = await api.post<ISignupResponse>(Points.signup, {
                username
            });
            return res.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.message);
            }
            return 'Unexpected error';
        }
    }
}