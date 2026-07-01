import express from "express";
import subjectsRouter from "./routes/subjects";
import cors from "cors";
const app = express();
const PORT = 8080;

if(!process.env.DATABASE_URL){
  throw new Error("DATABASE_URL is not set in .env file");
}

if(!process.env.FRONTEND_URL){
  throw new Error("FRONTEND_URL is not set in .env file");
}

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))

app.use(express.json());


app.use('/api/subjects', subjectsRouter);


app.get("/", (_req, res) => {
  res.json({ message: "Classroom backend is running." });
});



// Thse server will listen on the specified port and log a message when it starts successfully.
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
