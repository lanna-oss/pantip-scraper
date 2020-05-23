"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const comments_model_1 = __importDefault(require("../models/comments.model"));
const result_1 = require("../repository/result");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield db_1.connect(); }));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield db_1.clear(); }));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () { return yield db_1.close(); }));
const testDocument = {
    topic: "test topic",
    createDated: new Date().toISOString(),
    updateDated: new Date().toISOString(),
    results: ["comment1", "comment2"],
};
describe("Result Model suite", () => {
    it("Result model can create new model properly", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield comments_model_1.default.create(testDocument); })).not.toThrow();
    }));
    it("Result model can find an existing document properly", () => __awaiter(void 0, void 0, void 0, function* () {
        yield comments_model_1.default.create(testDocument);
        const result = yield comments_model_1.default.findOne({ topic: "test topic" });
        expect(result).not.toBeNull();
    }));
    it("Result model can insert new record", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = new comments_model_1.default(testDocument);
        expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield result.save(); })).not.toThrow();
    }));
    it(" Can save result for search by keyword", () => __awaiter(void 0, void 0, void 0, function* () {
        // const response = await saveSearchResult("bnk48", [
        //   "JaneBNK48",
        //   "cherprangBNK48"
        // ]);
        // expect(response).toBeNull();
        expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield result_1.saveSearchResult("bnk48", ["JaneBNK48", "cherprangBNK48"]); })).not.toThrow();
    }));
    it("Can search result with keyword macthing", () => __awaiter(void 0, void 0, void 0, function* () {
        const search = yield result_1.searchForResult("bnk48");
        expect(search).not.toBeNull();
    }));
});
//# sourceMappingURL=result.test.js.map