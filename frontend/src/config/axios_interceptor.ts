import axios from "axios";

export const setupAxiosInterceptors = () => {
	axios.defaults.withCredentials = true;
	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				window.location.href = "/login";
			}
			return Promise.reject(error);
		},
	);
};
