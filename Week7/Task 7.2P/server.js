const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/myprojectDB")
  .then(() => {
    console.log("MongoDB connection established successfully!");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);  
  });

const MessageSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const RandomNumberSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);
const RandomNumber = mongoose.model("RandomNumber", RandomNumberSchema);

let userCount = 0;

io.on("connection", (socket) => {
  userCount++;
  console.log(`A new user has connected! Total users: ${userCount}`);

  socket.on("sendMessage", async (messageContent) => {
    try {
      const newMessage = new Message({ content: messageContent });
      await newMessage.save();
      console.log("Message saved:", messageContent);
      io.emit("newMessage", messageContent); 
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("newNumberRequest", async () => {
    const newNumber = Math.floor(Math.random() * 100);
    try {
      const numberRecord = new RandomNumber({ value: newNumber });
      await numberRecord.save();
      console.log("Generated new number:", newNumber);
      io.emit("number", newNumber); 
    } catch (error) {
      console.error("Error saving random number:", error);
    }
  });

  RandomNumber.findOne()
    .sort({ timestamp: -1 })
    .limit(1)
    .then((latestNumber) => {
      if (latestNumber) {
        socket.emit("number", latestNumber.value);
      }
    })
    .catch((error) => console.error("Error fetching latest number:", error));

  Message.find()
    .sort({ timestamp: -1 })
    .limit(10)
    .then((messages) => {
      messages.forEach((message) => {
        socket.emit("newMessage", message.content);
      });
    })
    .catch((error) => console.error("Error fetching messages:", error));

  socket.on("disconnect", () => {
    userCount--;
    console.log(`A user disconnected. Total users: ${userCount}`);
  });
});

http.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});
