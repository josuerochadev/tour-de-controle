import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AuthenticationService from "../services/authentification_service";
import type { AuthUser } from "../types/user";

interface AuthContextValue {
	user: AuthUser | null;
	loading: boolean;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Provides authentication state (user, loading, logout) to the component tree. */
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

/**
 * Returns the current authentication context.
 * @throws If used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextValue => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
