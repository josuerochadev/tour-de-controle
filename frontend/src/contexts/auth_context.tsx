import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AuthenticationService from "../services/authentification_service";
import type { AuthUser } from "../types/user";

interface AuthContextValue {
	user: AuthUser | null;
	loading: boolean;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		AuthenticationService.getCurrentUser().then((fetchedUser) => {
			setUser(fetchedUser);
			setLoading(false);
		});
	}, []);

	const logout = useCallback(async () => {
		await AuthenticationService.logout();
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextValue => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
