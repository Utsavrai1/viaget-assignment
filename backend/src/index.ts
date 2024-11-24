import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoute from "./routes/AuthRoutes";
import bookRoute from "./routes/BookRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["https://bookhive-viaget.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req: Request, res: Response) => {
  res.send("Book Management App");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/book", bookRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
