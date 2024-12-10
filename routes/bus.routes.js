import { Router } from "express";
import {
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
} from "../controllers/bus.controller.js";

const router = Router();

router.route("/addBus").post(addBus);

router.route("/addRoutes").post(addRoutes);

router.route("/addStops").post(addStops);

router.route("/getAllBuses").get(getAllBuses);

router.route("/getRoutes/:busId").get(getBusWiseRoutes);

router.route("/getStops/:busId/:routeId").get(getStops);

router.route("/updateBusLocation").post(updateBusLocation);

router.route("/onBoardBusDriver").post(onBoardBusDriver);

router.route("/getAllBusDrivers").get(getAllBusDrivers);

router.route("/getRoutesAndStops/:busId").get(getRoutesAndStops);

export default router;
