import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setupAxiosInterceptors } from "./config/axios_interceptor";
import ErrorBoundary from "./components/error_boundary";
import { ToastProvider } from "./components/toast";
import { DialogProvider } from "./components/dialog";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgot_password";
import ResetPassword from "./pages/reset_password";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";
import AuthenticationLayout from "./layouts/authentication_layout";
import AddUser from "./pages/add_user";
import EditUser from "./pages/edit_user";
import ViewUser from "./pages/view_user";
import Contact from "./pages/contact";
import CashierPage from "./pages/cashier";
import Transactions from "./pages/transactions";

const App: React.FC = () => {
	useEffect(() => {
		setupAxiosInterceptors();
	}, []);

	return (
		<ErrorBoundary>
			<ToastProvider>
				<DialogProvider>
					<Router>
						<Routes>
							<Route path="/" element={<Login />} />
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
							</Route>
						<Route path="*" element={<Login />} />
						</Routes>
					</Router>
				</DialogProvider>
			</ToastProvider>
		</ErrorBoundary>
	);
};

export default App;
