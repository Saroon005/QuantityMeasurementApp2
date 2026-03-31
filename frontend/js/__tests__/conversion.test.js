import { applyConversion, compareValues, performArithmetic } from "../conversion.js";

describe("applyConversion", () => {
  test("applies factor conversion", () => {
    expect(applyConversion(2, { factor: 1000 })).toBe(2000);
  });

  test("applies formula conversion", () => {
    expect(applyConversion(32, { formula: "(x-32)*5/9" })).toBe(0);
  });

  test("returns original value when conversion object is missing", () => {
    expect(applyConversion(7, null)).toBe(7);
  });

  test("throws for invalid number", () => {
    expect(() => applyConversion(NaN, { factor: 2 })).toThrow("Invalid number");
  });
});

describe("compareValues", () => {
  test("reports GREATER when first base is larger", () => {
    expect(compareValues(2, "m", 100, "cm", 2, 1)).toContain("GREATER");
  });

  test("reports LESS when first base is smaller", () => {
    expect(compareValues(1, "m", 200, "cm", 1, 2)).toContain("LESS");
  });

  test("reports EQUAL when both base values match", () => {
    expect(compareValues(1, "m", 100, "cm", 1, 1)).toContain("EQUAL");
  });

  test("reports invalid comparison values", () => {
    expect(compareValues(1, "m", 100, "cm", Number.NaN, 1)).toBe("Invalid values — cannot compare");
  });
});

describe("performArithmetic", () => {
  test("adds two values", () => {
    expect(performArithmetic(3, 2, "+")).toBe(5);
  });

  test("subtracts two values", () => {
    expect(performArithmetic(3, 2, "-")).toBe(1);
  });

  test("multiplies two values", () => {
    expect(performArithmetic(3, 2, "*")).toBe(6);
  });

  test("divides two values", () => {
    expect(performArithmetic(3, 2, "/")).toBe(1.5);
  });

  test("throws on divide by zero", () => {
    expect(() => performArithmetic(3, 0, "/")).toThrow("Divide by zero");
  });

  test("throws on unknown operator", () => {
    expect(() => performArithmetic(3, 2, "%")).toThrow("Unknown operator");
  });
});
