import express from "express"
import mongoose from "mongoose"
import session from "express-session"
import methodOverride from "method-override"
import expressLayouts from "express-ejs-layouts"
import path from "path"
import dotenv from "dotenv"
import moment from "moment"
import blogRoutes from "./routes/blog.js"
import adminRoutes from "./routes/admin.js"
import apiRoutes from "./routes/api.js"
import { fileURLToPath } from "url"
import { dirname } from "path"

// __dirname setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static("public"))
app.use(
  session({
    secret: process.env.SESSION_SECRET || "lifevibe-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
)

// EJS Layout setup
app.use(expressLayouts)
app.set("layout", "layout") // Default layout file
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)

// View engine setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Make moment available in templates
app.locals.moment = moment

// Routes
app.use("/", blogRoutes)
app.use("/admin", adminRoutes)
app.use("/api", apiRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error", { error: "Something went wrong!" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", { error: "Page not found!" })
})

app.listen(PORT, () => {
  console.log(`LifeVibe Blog Platform running on port ${PORT}`)
})
