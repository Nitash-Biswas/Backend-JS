# Connecting to Database

```js
// /db/index.js
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED", error);
    process.exit(1);
  }
};

//connectDB is now imported elsewhere and called to initiate database connection.
export default connectDB;
```
```js
//constants.js
export const DB_NAME = 'testDatabase';
```

- **`mongoose.connect()`** : Returns an object response after connecting.
- **`DB_NAME`** : The MongoDB Database we are creating.
- **`process.env.MONGODB`** : MongoDB connection string in env file.
- **`connectionInstance.connection.host`** : MongoDB cluster we are connected to.
Helpful in finding if we are connected to the right database.

## Why the function `connectDB()` is a `async` ?
because the database is supposed to be in another continent, it takes time to send / get the data from it.

## Why `try/catch` ?
because the database is vulnerable to failures while sending / getting data.


