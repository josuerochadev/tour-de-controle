import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Header from "../components/header";
import { AuthProvider, useAuth } from "../contexts/auth_context";

const AuthenticationLayoutInner = () => {
	const { user, loading, logout } = useAuth();
	const navigate = useNavigate();

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

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-paper">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:rounded-xl focus:font-display focus:text-xs focus:uppercase focus:tracking-wider"
			>
				Aller au contenu principal
			</a>
			<Header onLogout={handleLogout} />
			<main id="main-content" className="px-8 py-8 pb-20 max-w-[1400px] mx-auto">
				<Outlet />
			</main>
		</div>
	);
};

const AuthenticationLayout = () => (
	<AuthProvider>
		<AuthenticationLayoutInner />
	</AuthProvider>
);

export default AuthenticationLayout;
