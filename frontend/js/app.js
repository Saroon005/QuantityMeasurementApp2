document.addEventListener("DOMContentLoaded", async () => {
	"use strict";

	const api = await import("./api.js");
	const ui = await import("./ui.js");

	const { getUnits, getHistory } = api;
	const { populateDropdown, setActive, showResult, toggleOperators, renderHistory } = ui;

	window.appState = {
		type: "Length",
		action: "Conversion",
		fromVal: null,
		fromUnit: "",
		toVal: null,
		toUnit: "",
		operator: "+"
	};

	const state = window.appState;

	async function loadUnits(type) {
		const fromSelect = document.querySelector("#from-unit");
		const toSelect = document.querySelector("#to-unit");
		if (!fromSelect || !toSelect) {
			return;
		}

		const units = await getUnits(type);
		populateDropdown(fromSelect, units);
		populateDropdown(toSelect, units);
	}

	async function loadHistory() {
		const records = await getHistory();
		renderHistory(records);
	}

	function attachEventListeners() {
		const typeSelector = document.querySelector("#type-selector");
		const fromInput = document.querySelector("#from-value");
		const toInput = document.querySelector("#to-value");
		const fromSelect = document.querySelector("#from-unit");
		const toSelect = document.querySelector("#to-unit");

		document.querySelectorAll(".type-card").forEach((card) => {
			card.addEventListener("click", async () => {
				state.type = card.dataset.type;
				setActive(typeSelector, card, ".type-card");

				if (fromInput) {
					fromInput.value = "";
				}
				if (toInput) {
					toInput.value = "";
				}
				showResult(0, "");

				try {
					const units = await getUnits(state.type);
					if (!Array.isArray(units) || units.length === 0) {
						throw new Error("Failed to load units");
					}
					populateDropdown(fromSelect, units);
					populateDropdown(toSelect, units);
					state.fromUnit = "";
					state.toUnit = "";
				} catch (error) {
					console.error(error);
					alert("Failed to load units");
				}
			});
		});

		const actionSelector = document.querySelector("#action-selector");
		const actionButtons = document.querySelectorAll(".action-btn");
		for (const btn of actionButtons) {
			btn.addEventListener("click", () => {
				state.action = btn.dataset.action;
				setActive(actionSelector, btn, ".action-btn");
				toggleOperators(state.action === "Arithmetic");
				showResult(0, "");
			});
		}

		const operatorSelector = document.querySelector("#operator-selector");
		const operatorButtons = document.querySelectorAll(".operator-btn");
		for (const btn of operatorButtons) {
			btn.addEventListener("click", async () => {
				const op = btn.getAttribute("data-op") || "+";
				state.operator = op;
				setActive(operatorSelector, btn, ".operator-btn");
			});
		}

		const fromValueInput = document.querySelector("#from-value");
		if (fromValueInput) {
			fromValueInput.addEventListener("input", async () => {
				const raw = fromValueInput.value;
				state.fromVal = raw === "" ? null : Number(raw);
			});
		}

		const toValueInput = document.querySelector("#to-value");
		if (toValueInput) {
			toValueInput.addEventListener("input", async () => {
				const raw = toValueInput.value;
				state.toVal = raw === "" ? null : Number(raw);
			});
		}

		const fromUnitSelect = document.querySelector("#from-unit");
		if (fromUnitSelect) {
			fromUnitSelect.addEventListener("change", async () => {
				state.fromUnit = fromUnitSelect.value;
			});
		}

		const toUnitSelect = document.querySelector("#to-unit");
		if (toUnitSelect) {
			toUnitSelect.addEventListener("change", async () => {
				state.toUnit = toUnitSelect.value;
			});
		}
	}

	try {
		const typeSelector = document.querySelector("#type-selector");
		const actionSelector = document.querySelector("#action-selector");

		const firstTypeCard = document.querySelector(".type-card");
		if (firstTypeCard) {
			setActive(typeSelector, firstTypeCard, ".type-card");
		}

		const firstActionBtn = document.querySelector(".action-btn");
		if (firstActionBtn) {
			setActive(actionSelector, firstActionBtn, ".action-btn");
		}

		toggleOperators(false);

		attachEventListeners();
		await loadUnits("Length");
		await loadHistory();
	} catch {
		alert("Server unavailable");
	}
});
