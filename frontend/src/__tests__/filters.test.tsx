import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Filters from "../components/filters";

// Mock the auth service
vi.mock("../services/authentification_service", () => ({
	default: {
		getCurrentUser: vi.fn().mockResolvedValue({ role: 1 }),
	},
}));

describe("Filters", () => {
	it("should render the date input", () => {
		render(<Filters onDateChange={() => {}} />);
		expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
	});

	it("should show today's date by default", () => {
		render(<Filters onDateChange={() => {}} />);
		const input = screen.getByLabelText(/date/i) as HTMLInputElement;
		const today = new Date().toISOString().split("T")[0];
		expect(input.value).toBe(today);
	});
});
