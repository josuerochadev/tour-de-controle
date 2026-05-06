import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
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
		return <p className="p-6">Chargement...</p>;
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	const handleLogout = () => {
		AuthenticationService.logout();
	};

	return (
		<div className="min-h-screen">
			<Header onLogout={handleLogout} />
			<main className="mt-16 mb-16 min-h-[calc(100vh-8rem)]">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default AuthenticationLayout;
