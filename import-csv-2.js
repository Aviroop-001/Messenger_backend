const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/Users");

const processCSV = async () => {
  try {
    // Wait for the MongoDB connection to be established
    await mongoose.connect(process.env.MONGODB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const csvFilePath = path.join(__dirname, "customer_messages.csv");
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", async (row) => {
        await User.findOneAndUpdate(
          { userID: parseInt(row["User ID"]) },
          {
            $push: {
              userMessages: {
                timestamp: new Date(row["Timestamp (UTC)"]),
                messageBody: row["Message Body"],
              },
            },
          },
          { upsert: true } // Create a new document if not found
        );
      })
      
      .on("end", () => {
        console.log("CSV file successfully processed.");
      });
  } catch (error) {
    console.error("Error processing CSV:", error);
  }
};

processCSV();
