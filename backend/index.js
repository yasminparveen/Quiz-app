import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors"; 

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
  console.log("Database connected successfully.");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: false },
});

const UserModel = mongoose.model("User", userSchema);

app.get("/getUsers", async (req, res) => {
  try {
    const userData = await UserModel.find({}, { password: 0 }); // Exclude password field
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new UserModel({
      username: username,
      email: email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Find user by username or email
    const user = await UserModel.findOne({ 
      $or: [{ username: username }, { email: email }] 
    });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // If login is successful, respond with success message
    res.status(200).json({ message: "Login successful", userId: user._id });
    
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
});


app.post("/addUser", async (req, res) => {
  try {
    const { name, age } = req.body;
    const newUser = new UserModel({ name, age });
    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});