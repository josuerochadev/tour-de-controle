import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordInputProps {
	id: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	name?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
	id,
	value,
	onChange,
	className = "",
	placeholder,
	required,
	disabled,
	name,
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="relative">
			<input
				id={id}
				name={name}
				type={showPassword ? "text" : "password"}
				value={value}
				onChange={onChange}
				className={`${className} pr-12`}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
			/>
			<button
				type="button"
				aria-label="Afficher le mot de passe"
				onClick={() => setShowPassword(!showPassword)}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-4 hover:text-ink bg-transparent border-none cursor-pointer"
				tabIndex={-1}
			>
				{showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
			</button>
		</div>
	);
};

export default PasswordInput;
