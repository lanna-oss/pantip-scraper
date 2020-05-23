"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var ResultSchema = new mongoose_1.Schema({
    topic: { type: String, require: true },
    createDated: { type: Date, require: true },
    updateDated: { type: Date, require: false },
    results: [{ type: String }]
}, { collection: "Results" });
exports.default = mongoose_1.model("Result", ResultSchema);
//# sourceMappingURL=comments.model.js.map