import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const supabase = createClient("SUPABASE_URL", "SUPABASE_ANON_KEY");
const JWT_SECRET = "supersecretkey"; // Replace with env variable in production

function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).send(error.message);
  res.send("User created");
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).send(error.message);

  const token = jwt.sign({ user_id: data.user.id }, JWT_SECRET);
  res.cookie("token", token, { httpOnly: true });
  res.send("Logged in");
});

app.post("/api/auth/logout", authMiddleware, (req, res) => {
  res.clearCookie("token");
  res.send("Logged out");
});

// Notes routes
app.get("/api/notes", authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", req.user.user_id);
  if (error) return res.status(400).send(error.message);
  res.json(data);
});

app.post("/api/notes", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { error } = await supabase
    .from("notes")
    .insert({ content, user_id: req.user.user_id });
  if (error) return res.status(400).send(error.message);
  res.send("Note added");
});

app.put("/api/notes/:id", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { error } = await supabase
    .from("notes")
    .update({ content })
    .eq("id", req.params.id)
    .eq("user_id", req.user.user_id);
  if (error) return res.status(400).send(error.message);
  res.send("Note updated");
});

app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", req.user.user_id);
  if (error) return res.status(400).send(error.message);
  res.send("Note deleted");
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
