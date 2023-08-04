import asyncHandler from "express-async-handler";
import User from "../model/usersModel.js";
import ApiError from "../utils/apiError.js";
import bcrypt from 'bcryptjs'
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getOneUser = asyncHandler(async (req, res, next) => {
  console.log("params: ", req.params.id);
  try {
    const user = await User.findById(req.params.id).populate({ path: "cars" });
    res.status(200).json(user);
    next();
  } catch (error) {
    return next(new ApiError("Pas d'utilisateur avec cet id", 404));
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: encryptedPassword,
    cars: req.body.cars,
    parentid: req.body.parentid,
    devices: req.body.devices,
    role: req.body.role,
    phone: req.body.phone,
  });

  try {
    const newUser = await user.save();
    if (newUser.parentid) {
      const parent = await User.findById(newUser.parentid);
      parent.users.push(newUser._id);
      await parent.save();
    }
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  // Check if the password field exists in req.body
  if (req.body.password) {
    // Check if the password is already hashed
    const user = await User.findById(req.params.id);
    if (user && user.password) {
      const isHashed = await bcrypt.compare(req.body.password, user.password);
      if (!isHashed) {
        // Generate a salt for hashing the password
        const saltRounds = 10;
        try {
          // Hash the password using bcrypt
          const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
          // Replace the original password in req.body with the hashed password
          req.body.password = hashedPassword;
        } catch (error) {
          // Handle hashing error if needed
          return next(new ApiError('Error hashing password', 500));
        }
      }
    }
  }

  // Continue with the update logic
  const document = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!document) {
    return next(new ApiError(`Pas d'utilisateur avec cet id ${req.params.id}`, 404));
  }

  // post middleware to update the average rating and quantity of reviews
  // MongoDB Trigger "save" to update the average rating and quantity of reviews
  document.save();
  res.status(200).json({ data: document });
});


const deleteUser = asyncHandler(async (req, res, next) => {
        const user = await  User.findByIdAndDelete(req.params.id)
        if(user){
            if(user.parentid) {
                const parent = await User.findById(user.parentid);
                if(!parent){
                    return next(
                        new ApiError(`Pas d'utilisateur avec cet id ${req.params.id}`, 404)
                      );
                }
                parent.users.pull(user._id);
                await parent.save();
            }
        }else {
            return next(
              new ApiError(`Pas d'utilisateur avec cet id ${req.params.id}`, 404)
            );
          }
        res.status(200).json({ message: "l'utilisateur a eté supprimé" });
      
})

export { getAllUsers, createUser, getOneUser, updateUser, deleteUser };
