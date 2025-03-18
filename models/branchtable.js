const mongoose= require('mongoose')
const DataSchema = new mongoose.Schema({
    branchSize: { type: Number,  },
    headerSize: { type: Number,  },
    Type: { type: String, default: "Nil" }, // Stores empty string instead of null
  });
const branchDetails=  mongoose.model('branchDetails',DataSchema)
module.exports=branchDetails