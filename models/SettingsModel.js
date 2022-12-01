const mongoose = require("mongoose");

const SettingsModelSchema = mongoose.Schema({
  key: {
    type: String
  },
  running : {
    type: Boolean,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("SettingsModel", SettingsModelSchema);
