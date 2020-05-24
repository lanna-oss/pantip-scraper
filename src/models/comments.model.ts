import { model, Schema } from "mongoose";

var ResultSchema = new Schema(
  {
    topic: { type: String, require: true },
    topicId: { type: String , require: true },  // topic Id in Pantip 
    createDated: { type: Date, require: true },
    updateDated: { type: Date, require: false },
    results: [{ type: String }]
  },
  { collection: "Results" }
);

export default model("Result", ResultSchema);
