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
