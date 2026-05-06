import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { DialogProvider, useDialog } from "../components/dialog";

const TestComponent = () => {
	const { showDialog } = useDialog();
	const handleClick = () => {
		showDialog({
			title: "Confirm",
			message: "Are you sure?",
			buttons: [
				{ label: "Cancel", className: "btn" },
				{ label: "OK", className: "btn-primary" },
			],
		});
	};
	return (
		<button type="button" onClick={handleClick}>
			Open Dialog
		</button>
	);
};

describe("DialogProvider", () => {
	it("should render children", () => {
		render(
			<DialogProvider>
				<div>Child</div>
			</DialogProvider>,
		);
		expect(screen.getByText("Child")).toBeInTheDocument();
	});

	it("should show dialog on trigger", () => {
		render(
			<DialogProvider>
				<TestComponent />
			</DialogProvider>,
		);
		act(() => {
			screen.getByText("Open Dialog").click();
		});
		expect(screen.getByText("Confirm")).toBeInTheDocument();
		expect(screen.getByText("Are you sure?")).toBeInTheDocument();
		expect(screen.getByText("Cancel")).toBeInTheDocument();
		expect(screen.getByText("OK")).toBeInTheDocument();
	});
});
