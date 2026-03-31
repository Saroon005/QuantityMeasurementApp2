import { jest } from "@jest/globals";
import { getUnits, getConversion, saveHistory, getHistory } from "../api.js";

describe("api module", () => {
  const originalFetch = global.fetch;
  const originalConsoleError = console.error;

  beforeEach(() => {
    global.fetch = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
  });

  test("getUnits returns parsed response data", async () => {
    const mockUnits = [{ symbol: "m", label: "Meter" }];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockUnits
    });

    const result = await getUnits("Length");

    expect(result).toEqual(mockUnits);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/units?type=Length");
  });

  test("getUnits returns empty array on fetch error", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const result = await getUnits("Length");

    expect(result).toEqual([]);
  });

  test("getConversion returns first conversion record", async () => {
    const mockConv = [{ from: "m", to: "cm", factor: 100 }];
    global.fetch.mockResolvedValue({
      json: async () => mockConv
    });

    const result = await getConversion("m", "cm");

    expect(result).toEqual(mockConv[0]);
  });

  test("getConversion throws when response has no conversion", async () => {
    global.fetch.mockResolvedValue({
      json: async () => []
    });

    await expect(getConversion("m", "unknown")).rejects.toThrow("No conversion found");
  });

  test("saveHistory posts record and returns response", async () => {
    const payload = { expression: "1 m", result: "100 cm" };
    const responseRecord = { ...payload, id: 1 };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => responseRecord
    });

    const result = await saveHistory(payload);

    expect(result).toEqual(responseRecord);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  });

  test("saveHistory returns null on HTTP error", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    const result = await saveHistory({ expression: "x", result: "y" });

    expect(result).toBeNull();
  });

  test("getHistory returns records", async () => {
    const history = [{ id: 1, expression: "1 m", result: "100 cm" }];
    global.fetch.mockResolvedValue({
      json: async () => history
    });

    const result = await getHistory();

    expect(result).toEqual(history);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/history?_sort=timestamp&_order=desc");
  });

  test("getHistory returns empty array on error", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const result = await getHistory();

    expect(result).toEqual([]);
  });
});
