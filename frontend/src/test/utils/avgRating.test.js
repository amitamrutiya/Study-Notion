import GetAvgRating from "../../utils/avgRating";

describe("GetAvgRating", () => {
  it("should return 0 when the array is empty", () => {
    expect(GetAvgRating([])).toBe(0);
  });

  it("should correctly calculate the average rating", () => {
    const ratings = [
      { rating: 5 },
      { rating: 4 },
      { rating: 3 },
      { rating: 2 },
      { rating: 1 },
    ];
    expect(GetAvgRating(ratings)).toBe(3);
  });

  it("should correctly round the average rating to one decimal place", () => {
    const ratings = [{ rating: 5 }, { rating: 4 }, { rating: 4 }];
    expect(GetAvgRating(ratings)).toBe(4.3);
  });
});
