import { Router } from "express";
import {
  invoiceGenerator,
  loginUser,
  signUp,
  userData,
  logout,
  invoiceNumber,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"
const router = Router();

router.route("/signup").post(upload.single("QRcode"),signUp);
router.route("/login").post(loginUser);
router.route("/add-invoice").post(invoiceGenerator);
router.route("/logout").get(verifyJWT,logout);
router.route("/user-data").get(verifyJWT, userData);
router.route("/invoice-number").get(verifyJWT, invoiceNumber);

export default router;
