import "dotenv/config"; // Load environment variables
import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer, { memoryStorage } from "multer";
import { v2 as cloudinary } from "cloudinary";
import Product from "./models/Product.js"; // Import Product Model

const app = express();
app.use(json());
app.use(cors());

// ✅ Ensure required environment variables are present & log missing ones
const requiredEnvVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "MONGO_URI", "PORT"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

// ✅ Fix Mongoose Deprecation Warning
mongoose.set("strictQuery", true);

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Connect to MongoDB with error handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Multer Storage for File Uploads
const storage = memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // Validate required fields
    const { make, model, year } = req.body;
    if (!make || !model || !year) {
      return res.status(400).json({ error: "Make, model, and year are required" });
    }

    // Check if a product with the same make, model, and year already exists
    const existingProduct = await Product.findOne({ make, model, year });
    if (existingProduct) {
      return res.status(400).json({ error: "Product with the same make, model, and year already exists" });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, cloudinaryResult) => {
          if (error) reject(error);
          else resolve(cloudinaryResult);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Save new product
    const newProduct = new Product({
      make,
      model,
      year,
      imageUrl: result.secure_url,
    });

    await newProduct.save();
    res.status(201).json({ message: "Uploaded successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  

// ✅ Fetch All Products with Filters, Sorting, and Pagination
app.get("/products", async (req, res) => {
    try {
      const { make, model, year, sort, page = 1, limit = 10 } = req.query;
  
      // ✅ Filtering Logic
      const filter = {};
      if (make) filter.make = make;
      if (model) filter.model = model;
      if (year) filter.year = parseInt(year);
  
      // ✅ Sorting Logic
      const sortOptions = {};
      if (sort === "newest") sortOptions.createdAt = -1; // Sort by latest added
      if (sort === "oldest") sortOptions.createdAt = 1;  // Sort by earliest added
      if (sort === "year_asc") sortOptions.year = 1;     // Sort by year ascending
      if (sort === "year_desc") sortOptions.year = -1;   // Sort by year descending
  
      // ✅ Pagination Logic
      const skip = (parseInt(page) - 1) * parseInt(limit);
  
      // ✅ Fetch Products with Filters, Sorting, and Pagination
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));
  
      // ✅ Total Product Count for Pagination
      const totalProducts = await Product.countDocuments(filter);
  
      res.json({
        success: true,
        total: totalProducts,
        page: parseInt(page),
        totalPages: Math.ceil(totalProducts / limit),
        products,
      });
  
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });


  // ✅ Update Product by ID
app.put("/api/products/:id", async (req, res) => {
    try {
      const { make, model, year, imageUrl } = req.body;
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { make, model, year, imageUrl },
        { new: true, runValidators: true } // Returns the updated product & validates input
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      res.json({ success: true, message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  
      if (!deletedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      res.json({ success: true, message: "Product deleted successfully", data: deletedProduct });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });


  app.get("/api/products/search", async (req, res) => {
    try {
      const { make, model, year } = req.query;
      let filter = {};
  
      if (make) filter.make = new RegExp(make, "i"); // Case-insensitive search
      if (model) filter.model = new RegExp(model, "i");
      if (year) filter.year = Number(year); // Convert year to a number
  
      const products = await Product.find(filter);
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  
  
  

// ✅ Default Route to Avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send(" Welcome to the API! Use /products to fetch data.");
});

// ✅ Start the Server
const serverPort = process.env.PORT || 3000;
app.listen(serverPort, () => console.log(`Mataa Gari Ventures Server running on port ${serverPort}`));

