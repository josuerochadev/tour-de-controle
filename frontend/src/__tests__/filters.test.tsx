import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Filters from "../components/filters";
import { AuthProvider } from "../contexts/auth_context";

// Mock the auth service
vi.mock("../services/authentification_service", () => ({
	default: {
		getCurrentUser: vi.fn().mockResolvedValue({ id: 1, first_name: "Test", last_name: "User", email: "test@test.com", role: 1 }),
		logout: vi.fn(),
	},
}));

const renderWithAuth = (ui: React.ReactElement) =>
	render(<AuthProvider>{ui}</AuthProvider>);

describe("Filters", () => {
	it("should render the date input", () => {
		renderWithAuth(<Filters onDateChange={() => {}} />);
		expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
	});

	it("should show today's date by default", () => {
		renderWithAuth(<Filters onDateChange={() => {}} />);
		const input = screen.getByLabelText(/date/i) as HTMLInputElement;
		const today = new Date().toISOString().split("T")[0];
		expect(input.value).toBe(today);
	});
});
