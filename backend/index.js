import express from "express"
import userRoutes from "./routes/user.route.js"
import profileRoutes from "./routes/profile.route.js"
import paymentRoutes from "./routes/payment.route.js"
import courseRoutes from "./routes/course.route.js"
import contactUsRoute from "./routes/contactUs.route.js"
import connectDB from "./config/database.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { cloudinaryConnect } from "./config/cloudinary.js"
import fileUpload from "express-fileupload"
import dotenv from "dotenv"

dotenv.config({
  path: "./env",
})

const app = express()

// database connect
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`⚙️   Server is running at port : ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err)
  })

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.REACT_FRONTED_URL,
    credentials: true,
  }),
)

app.use(
  fileUpload({
    useTempFiles: true, // this middeare is for fileupload in local media
    tempFileDir: "/tmp",
  }),
)

// cloudinary connection
cloudinaryConnect()

// routes
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/reach", contactUsRoute)

// def route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  })
})
