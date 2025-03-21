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
      enum: [
        "Toyota",
        "Honda",
        "Nissan",
        "Mazda",
        "Subaru",
        "Mitsubishi",
        "Suzuki",
        "Isuzu",

        "Mercedes-Benz",
        "BMW",
        "Audi",
        "Volkswagen",
        "Porsche",
        "Opel",

        "Ford",
        "Chevrolet",
        "Dodge",
        "Jeep",
        "Tesla",
        "Cadillac",

        "Hyundai",
        "Kia",
        "Genesis",

        "Land Rover",
        "Jaguar",
        "Rolls-Royce",
        "Bentley",
        "Mini",

        "Ferrari",
        "Lamborghini",
        "Maserati",
        "Alfa Romeo",
        "Fiat",

        "Peugeot",
        "Renault",
        "Citroën",
        "BYD",
        "Geely",
        "Chery",
        "Haval",
      ],
      set: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(), // Fix case sensitivity
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
    description: {
      type: String,
      required: false,
      trim: true,
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
