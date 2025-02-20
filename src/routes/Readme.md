# Routes
We keep the routes separate
### routes/user.routes.js
```js
import { Router } from "express";
import registerUser from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser)
export default userRouter
```

### app.js
```js
//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration

//as the routes and controller are in different files we use them as middleware app.use() instead of app.get()
app.use("/users", userRouter)
```

- User directs to **`/users`** using **`app.use("/users", userRouter)`**.
- Then the routing is forwarded by **`userRouter`**.
- **`userRouter.route("/register")`** takes the user to the final url.
- Final Url becomes **`localhost:3000/users/register/`**
- Finally, **`post`** request is sent via **`registerUser`** controller.



