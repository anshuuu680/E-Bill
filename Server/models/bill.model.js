import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceDate: {
    type: String,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  contact: {
    type: String,
  },
  items: [
    {
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      cgst: {
        type: Number,
        default: 0,
      },
      sgst: {
        type: Number,
        default: 0,
      },
    },
  ],
  paymentMode: {
    type: String,
    enum: ["Cash", "Debit/Credit Card", "Cheque", "Finance", "Upi"],
  },
  emi: {
    type: String,
  },
  adjustment: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  totalQuantity:{
  type:String,
  },
  totalTaxableValue: {
    type: String,
  },
  totalCgstAmount: {
    type: String,
  },
  totalSgstAmount: {
    type: String,
  },
  totalWithout:{
    type:String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  financeDetails: {
    financeBy: {
      type: String,
    },
    downPayment: {
      type: Number,
    },
    loanAmount: {
      type: Number,
    },
    loanNumber: {
      type: String,
    },
  },
});

export const Invoice = mongoose.model("Invoice", invoiceSchema);
