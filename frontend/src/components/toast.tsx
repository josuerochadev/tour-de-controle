import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { TOAST_DURATION_MS } from "../constants";

const ERROR_TOAST_DURATION_MS = 8000;

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

/** Returns the toast context, providing the showToast method. */
export const useToast = () => useContext(ToastContext);

let toastId = 0;

/** Context provider that manages toast notifications and renders them in a fixed overlay. */
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
			<div className="fixed top-24 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
				))}
			</div>
		</ToastContext.Provider>
	);
};

const bgColors: Record<ToastType, string> = {
	success: "bg-ink text-paper",
	error: "bg-signal text-paper",
	info: "bg-ink text-paper",
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
	useEffect(() => {
		const duration = toast.type === "error" ? ERROR_TOAST_DURATION_MS : TOAST_DURATION_MS;
		const timer = setTimeout(onClose, duration);
		return () => clearTimeout(timer);
	}, [onClose, toast.type]);

	return (
		<div
			className={`${bgColors[toast.type]} px-5 py-3.5 rounded-2xl flex items-center justify-between min-w-72 animate-slide-in font-display text-sm tracking-wide`}
			role="alert"
		>
			<span>{toast.message}</span>
			<button
				type="button"
				onClick={onClose}
				className="ml-4 text-paper hover:text-paper-3 bg-transparent border-none cursor-pointer"
				aria-label="Fermer"
			>
				&#x2715;
			</button>
		</div>
	);
};
