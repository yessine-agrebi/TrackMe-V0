import { check, body } from "express-validator"; // ckeck ~ param, body, query, header, cookie, param
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import User from "../model/usersModel.js";

// eslint-disable-next-line import/prefer-default-export
export const signupValidator = [
  body("name")
    .notEmpty()
    .withMessage("le nom est obligatoire")
    .isLength({ min: 3 })
    .withMessage("le nom doit contenir au moins 3 caractères")
    .isLength({ max: 50 })
    .withMessage("le nom doit contenir au plus 50 caractères")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("le mot de passe est obligatoire")
    .isLength({ min: 8 })
    .withMessage("le mot de passe doit contenir au moins 8 caractères"),

  body("email")
    .notEmpty()
    .withMessage("l'email est obligatoire")
    .isEmail()
    .withMessage("l'email n'est pas valide")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("l'email est déjà utilisé");
      }
      return true;
    }),
  // tunisie ou france telephone number
  body("phone")
    .isMobilePhone("ar-TN")
    .withMessage("le téléphone n'est pas tunisien")
    .notEmpty()
    .withMessage("le téléphone est obligatoire"),
  body("role").optional(),
  validatorMiddleware,
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("l'email est obligatoire")
    .isEmail()
    .withMessage("l'email n'est pas valide"),
  body("password")
    .notEmpty()
    .withMessage("le mot de passe est obligatoire")
    .isLength({ min: 8 })
    .withMessage("le mot de passe doit contenir au moins 8 caractères"),

  validatorMiddleware,
];
