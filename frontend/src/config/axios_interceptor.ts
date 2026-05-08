import axios from "axios";

export const setupAxiosInterceptors = () => {
	axios.defaults.withCredentials = true;
	axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			const status = error.response?.status;

			if (status === 401) {
				window.location.href = "/login";
			} else if (status === 403) {
				console.warn("Access denied (403)");
			} else if (status && status >= 500) {
				console.error("Server error", status);
			} else if (error.code === "ECONNABORTED") {
				console.error("Request timeout");
			} else if (!error.response) {
				console.error("Network error — server unreachable");
			}

			return Promise.reject(error);
		},
	);
};
