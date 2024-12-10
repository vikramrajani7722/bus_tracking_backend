import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const addUser = asyncHandler(async (req, res) => {
  const { name, email, role, status } = req.body;

  if ([name, email, role, status].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already used");
  }

  const newUser = new User({
    name,
    email,
    role,
    status,
  });

  await newUser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "User registered successfully"));
});

const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.status === 0) {
    throw new ApiError(400, "User not approved yet");
  }

  return res.status(200).json(user);
  // .json(new ApiResponse(200, user, "User data fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "User" });

  if (!users.length) {
    throw new ApiError(404, "No Users found");
  }

  return res.status(200).json(users);
  // .json(new ApiResponse(200, users, "User data fetched successfully"));
});

// const updateUserStatus = asyncHandler(async (req, res) => {
//   const { email, id } = req.body;

//   if (!email && !id) {
//     throw new ApiError(400, "Either email or id is required");
//   }

//   let query = {};
//   if (email) {
//     query.email = email;
//   } else if (id) {
//     query._id = id;
//   }

//   const user = await User.findOne(query);

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   const newStatus = user.status === 0 ? 1 : 0;

//   const updatedUser = await User.findOneAndUpdate(
//     query,
//     { status: newStatus },
//     { new: true }
//   );

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, updatedUser, "User status changed successfully")
//     );
// });

const updateUserStatus = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // let query = {};
  // if (email) {
  //   query.email = email;
  // }

  const user = await User.findOne({email});

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newStatus = user.status == 0 ? 1 : 0;

  const updatedUser = await User.findOneAndUpdate(
    {email},
    { status: newStatus },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User status changed successfully")
    );
});

export { addUser, getUserByEmail, updateUserStatus, getAllUsers };
