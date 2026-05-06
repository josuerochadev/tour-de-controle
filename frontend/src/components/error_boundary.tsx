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
				<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
					<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Une erreur est survenue
						</h1>
						<p className="text-gray-600 mb-6">
							L'application a rencontré un problème inattendu.
						</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700"
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
