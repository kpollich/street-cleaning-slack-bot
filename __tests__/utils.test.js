const { isStreetCleaningDay } = require("../utils");

describe("in a month starting on a non street cleaning day", () => {
  test("returns true for first wednesday", () => {
    const date = new Date("1-3-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for third wednesday", () => {
    const date = new Date("1-17-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for first thursday", () => {
    const date = new Date("1-4-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for third thursday", () => {
    const date = new Date("1-18-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });
});

describe("in a month starting on a wednesday", () => {
  test("returns true for first wednesday", () => {
    const date = new Date("8-1-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for third wednesday", () => {
    const date = new Date("8-15-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for first thursday", () => {
    const date = new Date("8-2-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for third thursday", () => {
    const date = new Date("8-16-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });
});

describe("in a month starting on a thursday", () => {
  test("returns true for first wednesday", () => {
    const date = new Date("2-7-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for third wednesday", () => {
    const date = new Date("2-21-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for first thursday", () => {
    const date = new Date("2-1-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });

  test("returns true for third thursday", () => {
    const date = new Date("2-15-18");

    expect(isStreetCleaningDay(date)).toBe(true);
  });
});
