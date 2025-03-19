import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
      enum: ["Toyota", "Honda", "Nissan", "Mazda", "Subaru", "Mitsubishi"],
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(), // Fix case sensitivity
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2001,
      max: 2025,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not a valid year. Year must be an integer.",
      },
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
