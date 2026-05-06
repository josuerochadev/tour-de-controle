import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

interface ToastContextType {
	showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, type: ToastType = "info") => {
		const id = ++toastId;
		setToasts((prev) => [...prev, { id, message, type }]);
	}, []);

	const removeToast = useCallback((id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="fixed top-20 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
				))}
			</div>
		</ToastContext.Provider>
	);
};

const bgColors: Record<ToastType, string> = {
	success: "bg-green-500",
	error: "bg-red-500",
	info: "bg-cyan-600",
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(onClose, 4000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`${bgColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-72 animate-slide-in`}
			role="alert"
		>
			<span>{toast.message}</span>
			<button
				type="button"
				onClick={onClose}
				className="ml-4 text-white hover:text-gray-200"
				aria-label="Fermer"
			>
				✕
			</button>
		</div>
	);
};
