import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header";
import AuthenticationService from "../services/authentification_service";
import Footer from "../components/footer";

const AuthenticationLayout = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Récupérer l'utilisateur au chargement
	useEffect(() => {
		const fetchUser = async () => {
			const fetchedUser = await AuthenticationService.getCurrentUser();
			console.log("🔍 Vérification utilisateur dans AuthenticationLayout :", fetchedUser);
			setUser(fetchedUser);
			setLoading(false);
		};
		fetchUser();
	}, []);

	// Affichage temporaire pour éviter la redirection prématurée
	if (loading) {
		return <p>Chargement...</p>;
	}

	// Si l'utilisateur n'est pas connecté, on redirige vers /login
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