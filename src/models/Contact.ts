import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema =
  new Schema<IContact>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Contact =
  mongoose.models.Contact ||
  mongoose.model<IContact>(
    "Contact",
    contactSchema
  );

export default Contact;