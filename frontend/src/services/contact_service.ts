import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ContactService {
	async send(data: { name: string; email: string; message: string }): Promise<boolean> {
		try {
			await axios.post(`${BASE_URL}/contact`, data, { withCredentials: true });
			return true;
		} catch {
			return false;
		}
	}
}

export default new ContactService();
