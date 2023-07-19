import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import User from "../model/usersModel.js";
import { createToken, createRefreshToken } from "../utils/createToken.js";

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return next(new ApiError("email est obligatoire", 400));
  }
  if (!password) {
    return next(new ApiError("mot de passe est obligatoire", 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("email ou mot de passe incorrect", 401));
  }
  const token = createToken({ userId: user._id });
  const refreshToken = createRefreshToken({ userId: user._id });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  delete user._doc.password;
  req.user = user
  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

const logout = asyncHandler(async (req, res, next) => {
  const { cookies } = req;
  if (!cookies.refreshToken) {
    return next(new ApiError("vous n'êtes pas connecté", 401));
  }
  res.clearCookie("refreshToken", { httpOnly: true });
  res.status(200).json({
    status: "success",
    message: "vous êtes déconnecté",
  });
});

const protect = asyncHandler(async (req, res, next) => {
  // console.log(req.headers);
  let token;
  // 1) get token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("vous n'êtes pas connecté, veuillez vous connecter", 401)
    );
  }
  // 2) verification token
  const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // 3) check if user still exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "l'utilisateur lié à ce token n'existe plus, veuillez vous connecter",
        401
      )
    );
  }
  // 4) check if user changed password after the token was issued
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changedTimestamp) {
      return next(
        new ApiError(
          "l'utilisateur a récemment changé son mot de passe, veuillez vous reconnecter",
          401
        )
      );
    }
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const { cookies } = req;
  if (!cookies.refreshToken) {
    return next(
      new ApiError("vous n'êtes pas connecté, veuillez vous connecter", 401)
    );
  }
  const result = await jwt.verify(
    cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!result) {
    return next(
      new ApiError("vous n'êtes pas connecté, veuillez vous connecter", 401)
    );
  }
  const user = await User.findById(result.userId);
  if (!user) {
    return next(
      new ApiError(
        "l'utilisateur lié à ce token n'existe plus, veuillez vous connecter",
        401
      )
    );
  }
  const token = createToken({ userId: user._id });
  res.status(200).json({
    status: "success",
    token,
  });
});

const allowedTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("vous n'avez pas la permission de faire cela", 403)
      );
    }
    next();
  };

export {login, logout, protect, refreshToken, allowedTo}