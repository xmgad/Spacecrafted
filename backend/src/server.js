import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import http from "http"
import { startSocket } from "./config/socket.config.js"

// Setup environment
import dotenv from "dotenv"
dotenv.config()
const env = process.env
// Route imports
import userRoutes from "./routes/users.js"
import listingRoutes from "./routes/listings.js"
import stagingRoutes from "./routes/staging.js"
import favoriteRoutes from "./routes/favorite.js"
import notificationRoutes from "./routes/notification.js"
import conversationRoutes from "./routes/conversation.js"
import subscriptionRoutes from './routes/subscription.js';
import locationRoutes from "./routes/location.js"
import webhookRoutes from './routes/webhookRoutes.js';
import paymentRoutes from './routes/payment.js'; 




// Create Express app
const app = express()
const server = http.createServer(app)

// Configure CORS
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
)

app.use('/webhook', webhookRoutes)


// middleware
app.use(express.json()) // json access  //need to sort out formatting 
app.use((req, resp, next) => {
    // logging
    console.log(req.path, req.method)
    next()
})

// register routes
app.use("/api/user", userRoutes)
app.use("/api/listing", listingRoutes)
app.use("/api/stage", stagingRoutes)
app.use("/api/favorite", favoriteRoutes)
app.use("/api/notification", notificationRoutes)
app.use("/api/conversation", conversationRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use("/api/location", locationRoutes)
app.use('/api/payment', paymentRoutes) // Ensure this is correct



app.use((error, _req, res, _next) => {
    // global error handling
    console.error(error)
    res.status(error.status || 500).send({ error: error.message })
})


// start socket
startSocket(server)

// Connect to database
mongoose
    .connect(env.MONGO_URI)
    .then(() => {
        console.log("Connected to database")
        listenForRequests()
    })
    .catch((error) => {
        console.log(error)
    })

const listenForRequests = () => {
    server.listen(env.PORT, () => {
        console.log("listening on port", env.PORT)
    })
}
