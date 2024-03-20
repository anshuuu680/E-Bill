import { Invoice } from "../models/bill.model.js";
import { User } from "../models/company.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export const signUp = async (req, res) => {
  const {
    companyName,
    slogan,
    proprietorName,
    contact,
    address,
    email,
    instagramLink,
    addressLink,
    gstin,
    password,
  } = req.body;

  const QRcode = req.file?.path;

  if (!QRcode) {
    throw new ApiError(400, "avatar is required");
  }

  const avatar = await uploadOnCloudinary(QRcode);

  const existedUser = await User.findOne({
    $or: [{ companyName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with companyName or email already exists");
  }

  const user = await User.create({
    companyName,
    slogan,
    proprietorName,
    contact,
    address,
    addressLink,
    email,
    instagramLink,
    QRcode: avatar.url,
    gstin,
    password,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) throw new ApiError(500, "Something went wrong");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "email is required"));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "User does not exist"));
    }

    const isValid = await user.isPasswordCorrect(password, user);

    if (!isValid) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid user credentials"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const invoiceGenerator = async (req, res) => {
  const {
    name,
    invoiceNumber,
    date,
    address,
    city,
    contact,
    invoiceItems,
    adjustment,
    discount,
    paymentMode,
    emi,
    total,
    downPayment,
    financeBy,
    loanNumber,
    loanAmount,
  } = req.body;

  let existingInvoice = await Invoice.findOne({ invoiceNumber });

  let totalTaxableValue = 0;
  let totalCgstAmount = 0;
  let totalSgstAmount = 0;
  let totalQuantity = 0;
  let totalWithout = 0;

  invoiceItems.forEach((item) => {
    totalTaxableValue +=
      item.price * item.quantity -
      (item.price * item.quantity * (Number(item.cgst) + Number(item.sgst))) /
        100;
    const cgst = (item.quantity * item.price * item.cgst) / 100;
    const sgst = (item.quantity * item.price * item.sgst) / 100;
    totalCgstAmount += cgst;
    totalSgstAmount += sgst;
    totalQuantity += item.quantity;
    totalWithout += item.price * item.quantity;
  });

  if (existingInvoice) {
    existingInvoice.invoiceDate = date;
    existingInvoice.customer = name;
    existingInvoice.address = address;
    existingInvoice.city = city;
    existingInvoice.contact = contact;
    existingInvoice.items = invoiceItems;
    existingInvoice.paymentMode = paymentMode;
    existingInvoice.discount = discount;
    existingInvoice.adjustment = adjustment;
    existingInvoice.totalWithout = totalWithout;
    existingInvoice.totalAmount = Math.floor(
      total - (total * discount || 0) / 100 - (adjustment || 0)
    );
    existingInvoice.totalTaxableValue = totalTaxableValue;
    existingInvoice.totalCgstAmount = totalCgstAmount;
    existingInvoice.totalSgstAmount = totalSgstAmount;
    existingInvoice.totalQuantity = totalQuantity;

    if (paymentMode === "Finance") {
      existingInvoice.financeDetails = {
        financeBy,
        downPayment,
        loanAmount,
        loanNumber,
        emi,
      };
    }

    await existingInvoice.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, existingInvoice, "Invoice updated successfully")
      );
  } else {
    const newInvoice = new Invoice({
      invoiceNumber,
      invoiceDate: date,
      customer: name,
      address,
      city,
      contact,
      items: invoiceItems,
      paymentMode,
      discount,
      adjustment,
      totalWithout,
      totalAmount: total,
      totalTaxableValue,
      totalCgstAmount,
      totalSgstAmount,
      totalQuantity,
    });

    if (paymentMode === "Finance") {
      newInvoice.financeDetails = {
        financeBy,
        downPayment,
        loanAmount,
        loanNumber,
        emi,
      };
    }
    await newInvoice.save();
    return res
      .status(200)
      .json(new ApiResponse(200, newInvoice, "Invoice created successfully"));
  }
};

export const userData = (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Invoice updated successfully"));
};

export const logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
};

export const invoiceNumber = async (req, res) => {
  try {
    const userInvoiceCount = await Invoice.countDocuments({_id:req.user._id});
    
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userInvoiceCount,
          "Invoice count retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error counting invoices:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};
