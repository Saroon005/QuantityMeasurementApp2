export function populateDropdown(selectEl, units) {
	if (!selectEl) {
		console.warn("Invalid select element");
		return;
	}

	selectEl.innerHTML = "";

	const defaultOption = document.createElement("option");
	defaultOption.textContent = "-- Select Unit --";
	defaultOption.disabled = true;
	defaultOption.selected = true;
	selectEl.appendChild(defaultOption);

	if (!Array.isArray(units) || units.length === 0) {
		return;
	}

	units.forEach((u) => {
		const opt = document.createElement("option");
		opt.value = u.symbol;
		opt.textContent = `${u.label} (${u.symbol})`;
		selectEl.appendChild(opt);
	});
}

export function setActive(parentEl, clickedEl, childSelector) {
	if (!parentEl) {
		return;
	}

	parentEl.querySelectorAll(childSelector).forEach((el) => {
		el.classList.remove("active");
	});

	clickedEl.classList.add("active");
}

export function showResult(value, unitSymbol) {
	const valueEl = document.querySelector("#result-value");
	const unitEl = document.querySelector("#result-unit");

	if (!valueEl || !unitEl) {
		return;
	}

	if (value === null) {
		valueEl.textContent = "—";
		unitEl.textContent = "";
		return;
	}

	valueEl.textContent = value;
	unitEl.textContent = unitSymbol;

	valueEl.classList.add("highlight");
	setTimeout(() => {
		valueEl.classList.remove("highlight");
	}, 1500);
}

export function toggleOperators(show) {
	const opEl = document.querySelector("#operator-selector");
	if (!opEl) {
		console.warn("Operator selector not found");
		return;
	}

	opEl.style.display = show ? "flex" : "none";
}

export function renderHistory(records) {
	const list = document.querySelector("#history-list");
	if (!list) {
		return;
	}

	if (records === undefined) {
		records = [];
	}

	list.innerHTML = "";

	if (!Array.isArray(records) || records.length === 0) {
		list.innerHTML = "<li>No history yet.</li>";
		return;
	}

	records.forEach((r) => {
		const li = document.createElement("li");
		li.textContent = `${r.expression}  =  ${r.result}  (${new Date(r.timestamp).toLocaleString()})`;
		list.appendChild(li);
	});
}
