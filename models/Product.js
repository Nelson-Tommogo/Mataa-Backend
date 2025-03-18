import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
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
      enum: ["Corolla", "Civic", "Xtrail", "Demio", "Forester", "Lancer"],
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(), // Fix case sensitivity
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
