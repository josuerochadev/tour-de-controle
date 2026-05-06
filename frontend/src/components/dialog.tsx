import React, { useState, useCallback, createContext, useContext } from "react";

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

	const showDialog = useCallback((options: DialogOptions): Promise<boolean> => {
		return new Promise((resolve) => {
			setDialog({ ...options, resolve });
		});
	}, []);

	const handleClose = (result: boolean) => {
		dialog?.resolve(result);
		setDialog(null);
	};

	return (
		<DialogContext.Provider value={{ showDialog }}>
			{children}
			{dialog && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
					role="dialog"
					aria-modal="true"
					aria-labelledby="dialog-title"
				>
					<div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
						<h2 id="dialog-title" className="text-xl font-bold text-gray-900 mb-4">
							{dialog.title}
						</h2>
						<p className="text-gray-700 mb-6">{dialog.message}</p>
						<div className="flex justify-end space-x-4">
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

// Compat layer for existing code that uses Dialog.show()
const Dialog = {
	_resolve: null as ((value: boolean) => void) | null,
	_setDialog: null as ((state: DialogState | null) => void) | null,

	show: (options: DialogOptions): Promise<boolean> => {
		return new Promise((resolve) => {
			const container = document.getElementById("dialog-root");
			if (!container) {
				resolve(false);
				return;
			}
			container.dispatchEvent(
				new CustomEvent("show-dialog", { detail: { ...options, resolve } }),
			);
		});
	},
};

export default Dialog;
