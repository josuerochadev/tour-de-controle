import React from "react";

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center bg-paper p-4">
					<div className="bg-paper-soft border border-sand rounded-3xl p-8 max-w-md w-full text-center">
						<h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink mb-4">
							Une erreur est survenue
						</h1>
						<p className="text-ink-3 mb-6">
							L'application a rencontre un probleme inattendu.
						</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="py-3 px-6 rounded-[14px] bg-ink text-paper border-none font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer hover:bg-ink-2 transition-colors"
						>
							Recharger la page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
