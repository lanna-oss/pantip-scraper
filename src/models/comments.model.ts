import { model, Schema } from "mongoose";

var ResultSchema = new Schema(
  {
    topic: { type: String, require: true },
    createDated: { type: Date, require: true },
    updateDated: { type: Date, require: false },
    results: [{ type: String }]
  },
  { collection: "Results" }
);

export default model("Result", ResultSchema);
