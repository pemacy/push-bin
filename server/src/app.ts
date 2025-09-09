import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import dotenv from "dotenv";
dotenv.config({ path: ".env.development", override: true });

import webHookRoutes from './routes/webHookRoutes'
import testingRoutes from './routes/testingRoutes'

const app = express()
// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // Important! Pass control to next middleware/route
});
app.use(cookieParser())
app.use(cors({ origin: ["http://localhost:5173", "http://ec2-18-233-152-10.compute-1.amazonaws.com/"], credentials: true }))
app.use(express.json())

app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use('/', webHookRoutes)
app.use('/api', webHookRoutes)
app.use('/testing', testingRoutes)

export default app
