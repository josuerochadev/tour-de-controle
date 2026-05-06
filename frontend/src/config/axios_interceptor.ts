// frontend/src/config/axios_interceptor.ts

import axios from "axios";

export const setupAxiosInterceptors = () => {
	axios.defaults.withCredentials = true;
	const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				localStorage.removeItem(TOKEN_KEY);
				window.location.href = "/login";
			}
			return Promise.reject(error);
		},
	);
};
