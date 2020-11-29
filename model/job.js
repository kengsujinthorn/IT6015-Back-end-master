const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  companyName: { type: String, required: false },
  wage: { type: Number, required: true },
  expDate: { type: Date, required: true },
  categories: [{ type: String, required: true }],
  companyAddress: { type: String, required: false },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  applier: [{ type: mongoose.Types.ObjectId, required: false, ref: "User" }],
});

module.exports = mongoose.model("job", jobSchema);
