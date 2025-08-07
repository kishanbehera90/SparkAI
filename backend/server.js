import express from 'express';
import cors from 'cors';
import "dotenv/config";
import aiRouter from './routes/airoutes.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { generateArticle } from './controllers/aicontroller.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import sql from './config/db.js'; 



const app = express();


await connectCloudinary();
app.use(clerkMiddleware());
app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
  res.send('Hello World!');
  
});
app.use(requireAuth());


app.use("/api/ai", aiRouter);
app.use('/api/user',userRouter)




// Protected routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});