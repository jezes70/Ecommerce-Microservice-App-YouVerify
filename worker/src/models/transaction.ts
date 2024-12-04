import { Schema, Model, model, Document } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TransactionAttrs {
  transactionRef: string;
  orderId: string;
  customerId: string;
  productId: string;
  totalAmount: number;
}

interface TransactionDocument extends Document {
  transactionRef: string;
  orderId: string;
  customerId: string;
  productId: string;
  totalAmount: number;
  createdAt: string;
}

interface TransactionModel extends Model<TransactionDocument> {
  build(attrs: TransactionAttrs): TransactionDocument;
}

const transactionSchema = new Schema(
  {
    transactionRef: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

transactionSchema.set("versionKey", "version");
transactionSchema.plugin(updateIfCurrentPlugin);

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction = model<TransactionDocument, TransactionModel>(
  "Transaction",
  transactionSchema
);

export default Transaction;
