import React, { useState, useCallback, createContext, useContext, useEffect, useRef } from "react";

interface DialogButton {
	label: string;
	className: string;
}

interface DialogOptions {
	title: string;
	message: string;
	buttons: DialogButton[];
}

interface DialogState extends DialogOptions {
	resolve: (value: boolean) => void;
}

interface DialogContextType {
	showDialog: (options: DialogOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType>({ showDialog: () => Promise.resolve(false) });

export const useDialog = () => useContext(DialogContext);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [dialog, setDialog] = useState<DialogState | null>(null);
	const triggerRef = useRef<Element | null>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	const showDialog = useCallback((options: DialogOptions): Promise<boolean> => {
		triggerRef.current = document.activeElement;
		return new Promise((resolve) => {
			setDialog({ ...options, resolve });
		});
	}, []);

	const handleClose = useCallback((result: boolean) => {
		setDialog((prev) => {
			prev?.resolve(result);
			return null;
		});
		(triggerRef.current as HTMLElement | null)?.focus();
	}, []);

	useEffect(() => {
		if (!dialog || !dialogRef.current) return;

		const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		focusable[0]?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleClose(false);
				return;
			}
			if (e.key !== "Tab" || focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [dialog, handleClose]);

	return (
		<DialogContext.Provider value={{ showDialog }}>
			{children}
			{dialog && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60"
					role="dialog"
					aria-modal="true"
					aria-labelledby="dialog-title"
					aria-describedby="dialog-message"
				>
					<div ref={dialogRef} className="bg-paper-soft rounded-3xl p-8 max-w-sm w-full mx-4 border border-sand">
						<h2 id="dialog-title" className="font-display text-xl font-semibold uppercase tracking-tight text-ink mb-4">
							{dialog.title}
						</h2>
						<p id="dialog-message" className="text-ink-3 mb-6">{dialog.message}</p>
						<div className="flex justify-end gap-3">
							{dialog.buttons.map((button, index) => (
								<button
									key={button.label}
									type="button"
									className={button.className}
									onClick={() => handleClose(index === 1)}
								>
									{button.label}
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</DialogContext.Provider>
	);
};
