import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
	<div className="min-h-screen flex items-center justify-center bg-paper p-4">
		<div className="bg-paper-soft border border-sand rounded-3xl p-8 w-full max-w-md text-center">
			<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4 mb-4">// Erreur 404</div>
			<h1 className="font-display text-[56px] font-semibold leading-none tracking-tight uppercase text-ink mb-4">
				Cap perdu
			</h1>
			<p className="text-ink-3 mb-8">
				Cette page n'existe pas ou a été déplacée.
			</p>
			<Link
				to="/login"
				className="inline-block py-3 px-6 rounded-[14px] bg-ink text-paper font-display text-[13px] font-semibold tracking-wider uppercase no-underline hover:bg-ink-2 transition-colors"
			>
				Retour à la connexion
			</Link>
		</div>
	</div>
);

export default NotFound;
