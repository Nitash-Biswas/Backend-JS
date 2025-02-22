# Models

## User.model.js

```js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({...}, { timestamps: true });
```

### Using middleware

```js
userSchema.pre("save", async function (next) {
  //if the password is not modified, skips the hashing logic
  // and moves to the next middleware or saves the document

  if (!this.isModified("password")) return next();

  //else update the password with encrypted password

  this.password = await bcrypt.hash(this.password, 10);

  next();
});
```

- **`.pre("save")`**

  - Middleware runs before saving a document to the database.
  - Often used for operations like password hashing, data validation, etc.

- **`next()`**

  - Signals Mongoose to proceed to the next middleware in the middleware stack.
  - If there are no other middlewares, it proceeds with the save operation.
  - If `next()` is not called, the request hangs indefinitely, causing the operation to never complete.

- **`this`** refers to the model **`User`**.
- We're using **`function(next){}`** instead of callback **`() => {}`**,
  because callback don't have access to "this" reference.
- **`bcrypt.hash(this.password, 10)`**, the 10 represents salt rounds—the higher the number, the stronger but slower the hashing.

### Matching passwords

```js
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
```

- **`isPasswordCorrect()`** is an custom instance method, added to the default methods of userSchema(), `userSchema.methods`.
- **`bcrypt.compare(password, this.password):`**
  - returns `true` when passwords match.
  - `password:` plain text password given by user.
  - `this.password:` hashed password stored in the database.

### Custom methods for generating JsonWebToken (JWT)

### 1. generateAccessToken()

```js
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    //payload object
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    // Secret key to sign the token (from environment variables)
    process.env.ACCESS_JWT_TOKEN_SECRET,

    //Token expiry object
    {
      expiresIn: ACCESS_JWT_TOKEN_EXPIRY, //expires in 1 day
    }
  );
};
```

### 2. generateRefreshToken()

```js
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
      expiresIn: REFRESH_JWT_TOKEN_EXPIRY,  //expires in 10 days
    }
  );
};

export const User = mongoose.model("User", userSchema);
```

## Video.model.js

```js
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({...}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
```
