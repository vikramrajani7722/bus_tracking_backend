import { Bus } from "../models/bus.model.js";
import { Stops } from "../models/stops.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Route } from "../models/routes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addBus = asyncHandler(async (req, res) => {
  const { name, number, lat, long, driverId, driverName, active } = req.body;

  if ([name, number].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  let validDriverId = null;
  if (driverId !== "0" && driverId) {
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      throw new ApiError(400, "Invalid driverId format");
    }
    validDriverId = mongoose.Types.ObjectId(driverId);
  }

  if (lat == null || long == null || lat === 0 || long === 0) {
    throw new ApiError(
      400,
      "Latitude and longitude are required and must be valid non-zero values"
    );
  }

  const existingBus = await Bus.findOne({ number });

  if (existingBus) {
    throw new ApiError(409, "Bus number already used");
  }

  const newBus = new Bus({
    name,
    number,
    lat,
    long,
    active,
    validDriverId,
    driverName,
  });

  await newBus.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { id: newBus._id }, "Bus added successfully"));
});

const addRoutes = asyncHandler(async (req, res) => {
  const {
    busId,
    fromRouteName,
    fromRouteLat,
    fromRouteLong,
    toRouteName,
    toRouteLat,
    toRouteLong,
  } = req.body;

  if ([fromRouteName, toRouteName].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fromRouteName or toRouteName are required");
  }

  if (
    !busId ||
    fromRouteLat == null ||
    fromRouteLong == null ||
    toRouteLat == null ||
    toRouteLong == null ||
    busId === 0 ||
    fromRouteLat === 0 ||
    fromRouteLong === 0 ||
    toRouteLat === 0 ||
    toRouteLong === 0
  ) {
    throw new ApiError(
      400,
      "Latitude and longitude are required and must be valid non-zero values"
    );
  }

  if (
    fromRouteLat < -90 ||
    fromRouteLat > 90 ||
    fromRouteLong < -180 ||
    fromRouteLong > 180 ||
    toRouteLat < -90 ||
    toRouteLat > 90 ||
    toRouteLong < -180 ||
    toRouteLong > 180
  ) {
    throw new ApiError(
      400,
      "Latitude must be between -90 and 90, and longitude between -180 and 180"
    );
  }

  if (!mongoose.Types.ObjectId.isValid(busId)) {
    return res.status(400).json({ message: "Invalid busId format" });
  }

  const existingBus = await Bus.findById(busId);

  if (!existingBus) {
    throw new ApiError(404, "Bus does not exists");
  }

  const newRoute = new Route({
    busId,
    fromRouteName,
    fromRouteLat,
    fromRouteLong,
    toRouteName,
    toRouteLat,
    toRouteLong,
  });

  await newRoute.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { id: newRoute._id }, "Route added successfully")
    );
});

const addStops = asyncHandler(async (req, res) => {
  const { busId, routeId, name, lat, long } = req.body;

  if ([name].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fromRouteName or toRouteName are required");
  }

  if (
    !busId ||
    !routeId ||
    lat == null ||
    long == null ||
    busId === 0 ||
    lat === 0 ||
    long === 0 ||
    routeId === 0
  ) {
    throw new ApiError(
      400,
      "Latitude and longitude are required and must be valid non-zero values"
    );
  }

  if (lat < -90 || lat > 90 || long < -180 || long > 180) {
    throw new ApiError(
      400,
      "Latitude must be between -90 and 90, and longitude between -180 and 180"
    );
  }

  if (!mongoose.Types.ObjectId.isValid(busId)) {
    return res.status(400).json({ message: "Invalid busId format" });
  }

  if (!mongoose.Types.ObjectId.isValid(routeId)) {
    return res.status(400).json({ message: "Invalid routeId format" });
  }

  const existingBus = await Bus.findById(busId);

  if (!existingBus) {
    throw new ApiError(404, "Bus does not exists");
  }

  const existingRoute = await Route.findById(routeId);

  if (!existingRoute) {
    throw new ApiError(404, "Route does not exists");
  }

  const newStop = new Stops({
    name,
    lat,
    long,
    busId,
    routeId,
  });

  await newStop.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newStop, "Stop added successfully"));
});

const getAllBuses = asyncHandler(async (req, res) => {
  const buses = await Bus.find();

  if (!buses.length) {
    throw new ApiError(404, "No Buses found");
  }

  return res.status(200).json(buses);
  // .json(new ApiResponse(200, users, "User data fetched successfully"));
});

const getBusWiseRoutes = asyncHandler(async (req, res) => {
  const { busId } = req.params;

  console.log("busId:", busId);

  if (!mongoose.Types.ObjectId.isValid(busId)) {
    throw new ApiError(400, "Invalid busId format");
  }

  const bus = await Bus.findById(busId);

  if (!bus) {
    throw new ApiError(404, "No Bus found");
  }

  const routes = await Route.find({ busId });

  if (routes.length === 0) {
    throw new ApiError(404, "No Routes found");
  }

  return res.status(200).json(routes);
  // .json(new ApiResponse(200, users, "User data fetched successfully"));
});

const getRoutesAndStops = asyncHandler(async (req, res) => {
  const { busId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(busId)) {
    throw new ApiError(400, "Invalid busId format");
  }

  const bus = await Bus.findById(busId);

  if (!bus) {
    throw new ApiError(404, "No Bus found");
  }

  const routes = await Route.find({busId: busId });

  if (routes.length === 0) {
    throw new ApiError(404, "No Routes found");
  }

  const stops = await Stops.find({
    busId: new mongoose.Types.ObjectId(busId),
    routeId: new mongoose.Types.ObjectId(routes[0]._id),
  });

  if (stops.length === 0) {
    throw new ApiError(404, "No Stops found for the Route");
  }

  return res.status(200).json({routes, stops});
  // .json(new ApiResponse(200, users, "User data fetched successfully"));
});

const getStops = asyncHandler(async (req, res) => {
  const { busId, routeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(busId)) {
    throw new ApiError(400, "Invalid busId format");
  }

  if (!mongoose.Types.ObjectId.isValid(routeId)) {
    throw new ApiError(400, "Invalid routeId format");
  }

  const [bus, route] = await Promise.all([
    Bus.findById(busId),
    Route.findById(routeId),
  ]);

  if (!bus) {
    throw new ApiError(404, "No Bus found");
  }

  if (!route) {
    throw new ApiError(404, "No Routes found");
  }

  const stops = await Stops.find({ busId, routeId });

  if (stops.length === 0) {
    throw new ApiError(404, "No Stops found");
  }

  return res.status(200).json(stops);
  // .json(new ApiResponse(200, users, "User data fetched successfully"));
});

const updateBusLocation = asyncHandler(async (req, res) => {
  const { busId, lat, long } = req.body;

  if (!busId || !mongoose.Types.ObjectId.isValid(busId)) {
    throw new ApiError(400, "Invalid or missing busId");
  }

  if (lat == null || long == null || lat === 0 || long === 0) {
    throw new ApiError(
      400,
      "Latitude and longitude are required and must be valid non-zero values"
    );
  }

  const bus = await Bus.findById(busId);

  if (!bus) {
    throw new ApiError(404, "No Bus found with the provided busId");
  }

  bus.lat = lat;
  bus.long = long;

  await bus.save();

  return res
    .status(200)
    .json(new ApiResponse(200, bus, "Location updated successfully"));
});

const onBoardBusDriver = asyncHandler(async (req, res) => {
  const { busId, driverId, driverName } = req.body;

  if (!busId || !mongoose.Types.ObjectId.isValid(busId)) {
    throw new ApiError(400, "Invalid or missing busId");
  }

  if (!driverId || !mongoose.Types.ObjectId.isValid(driverId)) {
    throw new ApiError(400, "Invalid or missing driverId");
  }

  if ([driverName].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  const user = await User.findById(driverId);

  if (!user) {
    throw new ApiError(404, "No Driver found with the provided driverId");
  }

  const bus = await Bus.findById(busId);

  if (!bus) {
    throw new ApiError(404, "No Bus found with the provided busId");
  }

  bus.driverId = driverId;
  bus.driverName = driverName;

  await bus.save();

  return res
    .status(200)
    .json(new ApiResponse(200, bus, "Bus Driver assigned successfully"));
});

const getAllBusDrivers = asyncHandler(async (req, res) => {
  const busDrivers = await User.find({ role: "Busdriver" });

  if (!busDrivers.length) {
    throw new ApiError(404, "No Bus Drivers found");
  }

  return res.status(200).json(busDrivers);
  // .json(new ApiResponse(200, users, "User data fetched successfully"));
});

export {
  addBus,
  addRoutes,
  addStops,
  getAllBuses,
  getBusWiseRoutes,
  getStops,
  updateBusLocation,
  onBoardBusDriver,
  getAllBusDrivers,
  getRoutesAndStops,
};
