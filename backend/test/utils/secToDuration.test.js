import convertSecondsToDuration from "../../utils/secToDuration";

describe("convertSecondsToDuration", () => {
  it("should correctly convert seconds to hours and minutes", () => {
    expect(convertSecondsToDuration(3661)).toBe("1h 1m");
  });

  it("should correctly convert seconds to minutes and seconds", () => {
    expect(convertSecondsToDuration(61)).toBe("1m 1s");
  });

  it("should correctly convert seconds to seconds", () => {
    expect(convertSecondsToDuration(1)).toBe("1s");
  });
});
