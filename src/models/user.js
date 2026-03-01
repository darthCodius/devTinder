const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      maxlength: 50,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} is invalid email address`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          return validator.isStrongPassword(v);
        },
        message: (props) => `${props.value} is not a strong password`,
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["M", "male", "Male", "F", "female", "Female", "Others"],
        message: `{VALUE} is not a valid gender`,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://isobarscience-1bfd8.kxcdn.com/wp-content/uploads/2020/09/default-profile-picture1.jpg",
      validate: {
        validator: (v) => {
          return validator.isURL(v);
        },
        message: ({ value }) => `${value} is invalid image URL`,
      },
    },
    about: {
      type: String,
      default: "This is a default description of the user!",
    },
    skills: {
      type: [String],
    },
    // createdAt: { -> we are using timestamps:true so we do not need explicitly
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token Expiry Time
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isValid = await bcrypt.compare(password, user.password);
  return isValid;
};

module.exports = mongoose.model("User", userSchema);
