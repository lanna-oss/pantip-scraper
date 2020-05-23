import { connect, close, clear } from "./db";
import ResultModel from "../models/comments.model";
import { saveSearchResult, searchForResult } from "../repository/result";

beforeAll(async () => await connect());

afterEach(async () => await clear());

afterAll(async () => await close());

const testDocument = {
  topic: "test topic",
  createDated: new Date().toISOString(),
  updateDated: new Date().toISOString(),
  results: ["comment1", "comment2"],
};

describe("Result Model suite", () => {
  it("Result model can create new model properly", async () => {
    expect(async () => await ResultModel.create(testDocument)).not.toThrow();
  });

  it("Result model can find an existing document properly", async () => {
    await ResultModel.create(testDocument);
    const result = await ResultModel.findOne({ topic: "test topic" });
    expect(result).not.toBeNull();
  });

  it("Result model can insert new record", async () => {
    const result = new ResultModel(testDocument);
    expect(async () => await result.save()).not.toThrow();
  });

  it(" Can save result for search by keyword", async () => {
    // const response = await saveSearchResult("bnk48", [
    //   "JaneBNK48",
    //   "cherprangBNK48"
    // ]);
    // expect(response).toBeNull();
    expect(
      async () =>
        await saveSearchResult("bnk48", ["JaneBNK48", "cherprangBNK48"])
    ).not.toThrow();
  });

  it("Can search result with keyword macthing", async () => {
    const search = await searchForResult("bnk48");
    expect(search).not.toBeNull();
  });
});
