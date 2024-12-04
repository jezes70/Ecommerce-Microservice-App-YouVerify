import { Schema, Model, model, Document } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@devdezyn/common";

interface OrderAttrs {
  status: OrderStatus;
  customerId: string;
  productId: string;
  price: number;
}

interface OrderDocument extends Document {
  status: OrderStatus;
  customerId: string;
  productId: string;
  price: number;
  version: number;
  createdAt: string;
}

interface OrderModel extends Model<OrderDocument> {
  build(attrs: OrderAttrs): OrderDocument;
}

const orderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    customerId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    price: {
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = model<OrderDocument, OrderModel>("Order", orderSchema);

export { OrderStatus };
export default Order;
