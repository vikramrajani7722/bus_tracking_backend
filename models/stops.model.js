import mongoose, { Schema } from "mongoose";

const stopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    busId: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Stops = mongoose.model("Stops", stopSchema);
