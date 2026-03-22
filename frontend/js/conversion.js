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
