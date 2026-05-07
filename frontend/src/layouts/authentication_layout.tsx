import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header";
import AuthenticationService from "../services/authentification_service";
import type { AuthUser } from "../types/user";

const AuthenticationLayout = () => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		AuthenticationService.getCurrentUser().then((fetchedUser) => {
			setUser(fetchedUser);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-paper flex items-center justify-center">
				<p className="font-mono text-ink-4 text-sm tracking-wider uppercase">Chargement...</p>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	const handleLogout = () => {
		AuthenticationService.logout();
	};

	return (
		<div className="min-h-screen bg-paper">
			<Header onLogout={handleLogout} />
			<main className="px-8 py-8 pb-20 max-w-[1400px] mx-auto">
				<Outlet />
			</main>
		</div>
	);
};

export default AuthenticationLayout;
