import mongoose, { Schema } from "mongoose";

const routeSchema = new Schema(
  {
    busId: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    fromRouteName: {
      type: String,
      required: true,
      trim: true,
    },

    fromRouteLat: {
      type: Number,
      required: true,
    },
    fromRouteLong: {
      type: Number,
      required: true,
    },
    toRouteName: {
      type: String,
      required: true,
      trim: true,
    },
    toRouteLat: {
      type: Number,
      required: true,
    },
    toRouteLong: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Route = mongoose.model("Route", routeSchema);
