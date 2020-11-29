const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  companyAddress: { type: String, required: false },
  telNo: { type: String, required: true },
  image: { type: String, required: true },
  employer: { type: Boolean, required: true, default: false },
  website: { type: String, required: false },
  dob: { type: Date, required: false },
  resume: { type: String, required: false },
  jobs: [{ type: mongoose.Types.ObjectId, required: false, ref: "job" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
