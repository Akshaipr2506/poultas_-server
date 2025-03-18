const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  ITEM_TYPE: { type: String },
  FROM: { type: Number, required: true },
  TO: { type: Number, required: true },
  GEOMETRIC_STANDARD: { type: String, default: "Nil"},
  VDS: { type: String,  default: "Nil"},
  END_CONN1: { type: String, default: "Nil"},
  END_CONN2: { type: String, default: "Nil" },
  MATERIAL_DESCR: { type: String,  default: "Nil" },
  MDS: { type: String,  default: "Nil"},
  RATING: { type: String, default: "Nil"},
  SCHD: { type: String, default: "Nil" },
  NOTES: { type: String, default: "Nil"},
}, { timestamps: true });

const Materials = mongoose.model("Materials", MaterialSchema);

module.exports = Materials;