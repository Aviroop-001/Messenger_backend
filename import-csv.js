const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const dotenv = require("dotenv");
const Message = require("./models/Message"); // Adjust the path as needed

dotenv.config();

async function importCSVData() {
  try {
    // MongoDB connection setup
    await mongoose.connect(process.env.MONGODB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB Atlas");

    // Read and parse CSV
    const csvFilePath = path.join(__dirname, "customer_messages.csv");
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", async (row) => {
        try {
          // Create a new Message document and save it
          const newMessage = new Message({
            userId: parseInt(row["User ID"]),
            timestamp: new Date(row["Timestamp (UTC)"]),
            messageBody: row["Message Body"],
          });
          await newMessage.save();
        } catch (error) {
          console.error(`Error inserting: ${JSON.stringify(row)}`, error);
        }
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
      });
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

importCSVData();
 