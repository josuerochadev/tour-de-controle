import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class ContactService {
	static async send(data: { name: string; email: string; message: string }): Promise<boolean> {
		try {
			await axios.post(`${BASE_URL}/contact`, data, { withCredentials: true });
			return true;
		} catch {
			return false;
		}
	}
}
