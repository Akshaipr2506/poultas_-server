const express = require('express');

const router = new express.Router();

const BranchTable=require('./models/branchtable')
const Materials=require('./models/material')


router.post("/saveData", async (req, res) => {
    console.log("Received Data:", req.body);

    try {
        const dataArray = req.body;

        if (!Array.isArray(dataArray)) {
            console.error("Invalid data format:", dataArray);
            return res.status(400).json({ error: "Invalid data format. Expected an array." });
        }

        const savedData = await BranchTable.insertMany(dataArray);
        console.log("Saved Data:", savedData);

        res.status(201).json({ message: "Data saved successfully", savedData });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.post("/uploadData", async (req, res) => {

    try {
  
      const { data } = req.body;
      console.log(data);
      
  
  
  
      if (!Array.isArray(data) || data.length === 0) {
  
        return res.status(400).json({ error: "Invalid data format" });
  
      }
  
  
  
      // Define the expected schema order
  
      const expectedFields = [
  
        "ITEM_TYPE", "FROM", "TO", "GEOMETRIC_STANDARD", "VDS",
  
        "END_CONN1", "END_CONN2", "MATERIAL_DESCR", "MDS", "RATING", "SCHD", "NOTES"
  
      ];
  
  
  
      // Format data by mapping array elements to schema fields
  
      const formattedData = data.map((row) => {
  
        const obj = {};
  
        expectedFields.forEach((field, index) => {
  
          obj[field] = row[index] !== undefined ? row[index] : "";
  
        });
  
        return obj;
  
      });
  
  
  
      // Check for existing records (based on ITEM_TYPE and MATERIAL_DESCR)
  
      const existingRecords = await Materials.find({
  
        $or: formattedData.map((item) => ({
  
          ITEM_TYPE: item.ITEM_TYPE,
  
          MATERIAL_DESCR: item.MATERIAL_DESCR,
  
        })),
  
      });
  
  
  
      if (existingRecords.length > 0) {
  
        return res.status(406).json({ error: "Data already exists" });
  
      }
  
  
  
      // Insert new records
  
      await Materials.insertMany(formattedData);
  
      res.status(200).json({ message: "Data saved successfully" });
  
  
  
    } catch (error) {
  
      console.error("Error processing data:", error);
  
      res.status(500).json({ error: "Internal Server Error", details: error.message });
  
    }
  
  });

  router.get("/combineData", async (req, res) => {
    try {
      // Fetch all data from both collections
      const materials = await Materials.find({});
      const branchHeaders = await BranchTable.find({});
  
      let combinedResults = [];
  
      // Mapping of allowed type abbreviations to full names
      const allowedTypes = {
        WOL: "WELDOLET",
        TOL: "THREADOLET",
        WT: "STRAIGHT TEE",
      
        WRT: "REDUCING TEE",
        TR: "REDUCING TEE",
        WOF: "WELDOFLANGE"
      };
  
      materials.forEach((material) => {
        branchHeaders.forEach((branch) => {
          const mappedType = allowedTypes[branch.Type] || branch.Type; // Convert abbreviation to full name if applicable
          const isAllowedType = material.ITEM_TYPE === mappedType; // Check if itemSize matches the mapped Type
          const isSameSize = branch.branchSize === branch.headerSize; // Check if sizes are the same
  
          if (
            (isAllowedType || isSameSize) && // Either itemSize matches allowed Type or sizes are the same
            
              branch.branchSize >= material.FROM &&
              branch.branchSize <= material.TO &&
              branch.headerSize >= material.FROM &&
              branch.headerSize <= material.TO
            
          ) {
            let mergedData = {
              ...material.toObject(),
              Type: mappedType,
              Headersize: branch.headerSize,
              branchSize: branch.branchSize
            };
  
            combinedResults.push(mergedData);
          }
        });
      });
  
      const limitedResults = combinedResults.slice(0, 1000);
  
      res.status(200).json({ matchedData: combinedResults });
  
    } catch (error) {
      console.error("❌ Error in combining data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router