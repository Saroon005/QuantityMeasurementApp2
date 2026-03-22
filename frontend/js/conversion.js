export function applyConversion(value, convObj) {
	if (!Number.isFinite(value)) {
		throw new Error("Invalid number");
	}

	if (convObj === null || convObj === undefined) {
		return value;
	}

	if (convObj.factor !== null && convObj.factor !== undefined) {
		return parseFloat((value * convObj.factor).toFixed(6));
	}

	try {
		const formula = String(convObj.formula ?? "");
		const expr = formula.replace("x", String(value));
		const result = eval(expr);
		return parseFloat(Number(result).toFixed(6));
	} catch {
		throw new Error("Bad formula");
	}
}

export function compareValues(v1, u1, v2, u2, base1, base2) {
	if (!Number.isFinite(base1) || !Number.isFinite(base2)) {
		return "Invalid values — cannot compare";
	}

	if (base1 > base2) {
		return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
	}

	if (base1 < base2) {
		return `${v1} ${u1} is LESS than ${v2} ${u2}`;
	}

	return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}
