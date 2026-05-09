import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { setupAxiosInterceptors } from "./config/axios_interceptor";
import ErrorBoundary from "./components/error_boundary";
import { ToastProvider } from "./components/toast";
import { DialogProvider } from "./components/dialog";

// Eager-loaded: login is the entry point, 404 is lightweight
import Login from "./pages/login";
import NotFound from "./pages/not_found";

// Lazy-loaded: split per route
const ForgotPassword = lazy(() => import("./pages/forgot_password"));
const ResetPassword = lazy(() => import("./pages/reset_password"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Users = lazy(() => import("./pages/users"));
const AuthenticationLayout = lazy(() => import("./layouts/authentication_layout"));
const AddUser = lazy(() => import("./pages/add_user"));
const EditUser = lazy(() => import("./pages/edit_user"));
const ViewUser = lazy(() => import("./pages/view_user"));
const Contact = lazy(() => import("./pages/contact"));
const CashierPage = lazy(() => import("./pages/cashier"));
const Transactions = lazy(() => import("./pages/transactions"));
const Logs = lazy(() => import("./pages/logs"));

const App: React.FC = () => {
	useEffect(() => {
		setupAxiosInterceptors();
	}, []);

	return (
		<ErrorBoundary>
			<ToastProvider>
				<DialogProvider>
					<Router>
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-paper"><p className="text-ink-3">Chargement...</p></div>}>
						<Routes>
							<Route path="/" element={<Navigate to="/login" replace />} />
							<Route path="/login" element={<Login />} />
							<Route path="/forgot-password" element={<ForgotPassword />} />
							<Route path="/reset-password" element={<ResetPassword />} />
							<Route path="/contact" element={<Contact />} />
							<Route element={<AuthenticationLayout />}>
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/users" element={<Users />} />
								<Route path="/users/add" element={<AddUser />} />
								<Route path="/users/edit/:id" element={<EditUser />} />
								<Route path="/users/view/:id" element={<ViewUser />} />
								<Route path="/cash-register" element={<CashierPage />} />
								<Route path="/transactions" element={<Transactions />} />
								<Route path="/logs" element={<Logs />} />
							</Route>
						<Route path="*" element={<NotFound />} />
						</Routes>
						</Suspense>
					</Router>
				</DialogProvider>
			</ToastProvider>
		</ErrorBoundary>
	);
};

export default App;
