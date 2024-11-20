import mongoose, { models, Schema } from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    beds: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    square_feet: {
      type: Number,
      required: true,
    },
    amenities: [String],
    rates: {
      nightly: Number,
      weekly: Number,
      monthly: Number,
    },
    seller_info: {
      name: String,
      email: String,
      phone: String,
    },
    images: [String],
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);

export default Property;
