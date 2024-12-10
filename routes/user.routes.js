import { Router } from "express";
import {
  addUser,
  getUserByEmail,
  updateUserStatus,
  getAllUsers,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/add").post(addUser);

router.route("/getUserByEmail").get(getUserByEmail);

router.route("/changestatus").post(updateUserStatus);

router.route("/getAllUsers").get(getAllUsers);

export default router;
