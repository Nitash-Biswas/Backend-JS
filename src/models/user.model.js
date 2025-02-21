import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requiired: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //index:true helps in search optimisation
    },
    email: {
      type: String,
      requiired: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      requiired: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"], //true with error message if not given
    },
    refreshToken: {},
  },
  { timestamps: true }
);

//.pre() is the middleware to execute at the start of the model use.
//"save" means whenever the changes are saved
// "this" refers to the model "User"
// we're using function(next){} instead of callback () => {},
// because callback don't have access to "this" reference.
userSchema.pre("save", async function (next) {
  //if the password is not modified, move to next
  if (!this.isModified("password")) return next();
  //else encrypt the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Custom methods are always applied to the instances of User
//const userInstance = User.findOne({username})

//Adding a custom method isPasswordCorrect() to the methods of userSchema
//aysnc because encrption is slow in nature
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    //payload object
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    //access Token
    process.env.ACCESS_JWT_TOKEN_SECRET,
    //expiry object
    {
      expiresIn: process.env.ACCESS_JWT_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    //payload object
    {
      _id: this._id,
    },
    //access Token
    process.env.REFRESH_JWT_TOKEN_SECRET,
    //expiry object
    {
      expiresIn: process.env.REFRESH_JWT_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
