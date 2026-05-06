import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ToastProvider, useToast } from "../components/toast";

const TestComponent = () => {
	const { showToast } = useToast();
	return (
		<button type="button" onClick={() => showToast("Test message", "success")}>
			Show Toast
		</button>
	);
};

describe("ToastProvider", () => {
	it("should render children", () => {
		render(
			<ToastProvider>
				<div>Child content</div>
			</ToastProvider>,
		);
		expect(screen.getByText("Child content")).toBeInTheDocument();
	});

	it("should show toast on trigger", () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);
		act(() => {
			screen.getByText("Show Toast").click();
		});
		expect(screen.getByText("Test message")).toBeInTheDocument();
	});
});
