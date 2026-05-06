interface DialogProps {
	title: string;
	message: string;
	buttons: {
		label: string;
		className: string;
	}[];
}

const Dialog = {
	show: ({ title, message, buttons }: DialogProps): Promise<boolean> => {
		return new Promise((resolve) => {
			const dialog = document.createElement("div");
			dialog.className =
				"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";

			dialog.innerHTML = `
  <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
    <h2 class="text-xl font-bold text-gray-900 mb-4">${title}</h2>
    <p class="text-gray-700 mb-6">${message}</p>
    <div class="flex justify-end space-x-4">
      ${buttons
				.map(
					(button) =>
						`<button class="${button.className}">${button.label}</button>`,
				)
				.join("")}
    </div>
  </div>
`;

			document.body.appendChild(dialog);

			const btnElements = dialog.getElementsByTagName("button");
			buttons.forEach((_, index) => {
				btnElements[index].addEventListener("click", () => {
					document.body.removeChild(dialog);
					resolve(index === 1);
				});
			});
		});
	},
};

export default Dialog;
