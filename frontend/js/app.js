document.addEventListener("DOMContentLoaded", async () => {
	"use strict";

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

	function setActive(elements, activeElement) {
		for (const element of elements) {
			const isActive = element === activeElement;
			element.classList.toggle("active", isActive);
			if (element.matches("button")) {
				element.setAttribute("aria-pressed", String(isActive));
			}
		}
	}

	function populateUnitDropdown(selectEl, units) {
		selectEl.innerHTML = "<option value=\"\" selected disabled>Select unit</option>";

		for (const unit of units) {
			const option = document.createElement("option");
			option.value = unit.symbol;
			option.textContent = `${unit.label} (${unit.symbol})`;
			selectEl.appendChild(option);
		}
	}

	async function loadUnits(type) {
		let response;
		try {
			response = await fetch(`http://localhost:3000/units?type=${encodeURIComponent(type)}`);
		} catch {
			throw new Error("SERVER_UNAVAILABLE");
		}

		if (!response.ok) {
			alert("Failed to load units");
			return;
		}

		let units;
		try {
			units = await response.json();
		} catch {
			alert("Failed to load units");
			return;
		}

		const fromUnitSelect = document.querySelector("#from-unit");
		const toUnitSelect = document.querySelector("#to-unit");

		if (!fromUnitSelect || !toUnitSelect) {
			return;
		}

		populateUnitDropdown(fromUnitSelect, Array.isArray(units) ? units : []);
		populateUnitDropdown(toUnitSelect, Array.isArray(units) ? units : []);
	}

	async function loadHistory() {
		let response;
		try {
			response = await fetch("http://localhost:3000/history?_sort=timestamp&_order=desc");
		} catch {
			throw new Error("SERVER_UNAVAILABLE");
		}

		if (!response.ok) {
			throw new Error("SERVER_UNAVAILABLE");
		}

		const history = await response.json();
		const historyList = document.querySelector("#history-list");
		if (!historyList) {
			return;
		}

		historyList.innerHTML = "";

		const historyItems = Array.isArray(history) ? history : [];
		if (historyItems.length === 0) {
			const emptyItem = document.createElement("li");
			emptyItem.textContent = "No history yet";
			historyList.appendChild(emptyItem);
			return;
		}

		for (const item of historyItems) {
			const li = document.createElement("li");
			li.textContent = typeof item === "object" && item !== null ? JSON.stringify(item) : String(item);
			historyList.appendChild(li);
		}
	}

	function attachEventListeners() {
		const typeCards = document.querySelectorAll(".type-card");
		for (const card of typeCards) {
			card.addEventListener("click", async () => {
				const nextType = card.getAttribute("data-type") || "Length";
				state.type = nextType;
				setActive(typeCards, card);
				try {
					await loadUnits(nextType);
				} catch {
					alert("Server unavailable");
				}
			});
		}

		const actionButtons = document.querySelectorAll(".action-btn");
		for (const btn of actionButtons) {
			btn.addEventListener("click", async () => {
				const nextAction = btn.getAttribute("data-action") || "Conversion";
				state.action = nextAction;
				setActive(actionButtons, btn);

				const operatorRow = document.querySelector("#operator-selector");
				if (operatorRow) {
					operatorRow.style.display = nextAction === "Arithmetic" ? "flex" : "none";
				}
			});
		}

		const operatorButtons = document.querySelectorAll(".operator-btn");
		for (const btn of operatorButtons) {
			btn.addEventListener("click", async () => {
				const op = btn.getAttribute("data-op") || "+";
				state.operator = op;
				setActive(operatorButtons, btn);
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
		const typeCards = document.querySelectorAll(".type-card");
		if (typeCards.length > 0) {
			setActive(typeCards, typeCards[0]);
		}

		const actionButtons = document.querySelectorAll(".action-btn");
		if (actionButtons.length > 0) {
			setActive(actionButtons, actionButtons[0]);
		}

		const operatorRow = document.querySelector("#operator-selector");
		if (operatorRow) {
			operatorRow.style.display = "none";
		}

		attachEventListeners();
		await loadUnits("Length");
		await loadHistory();
	} catch {
		alert("Server unavailable");
	}
});
