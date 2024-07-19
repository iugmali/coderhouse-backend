import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'carts',
  },
  role: {
    type: String,
    enum: ['admin', 'premium', 'user'],
    default: 'user',
  },
  password: String,
});

export default mongoose.model('users', userSchema);
