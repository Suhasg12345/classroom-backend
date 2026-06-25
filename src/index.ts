import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Classroom backend is running." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
