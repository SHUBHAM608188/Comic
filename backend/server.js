// ------------------- IMPORTS -------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import funds from "./routes/funds.js";

// ------------------- CONFIG -------------------
dotenv.config();

// ------------------- PATH SETUP -------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------- MIDDLEWARE -------------------
// ✅ Correct CORS configuration for Express 5
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local dev origins like http://localhost:3000
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow JWT Authorization header
    credentials: true,
  })
);



// ✅ Automatically handle all CORS preflight (OPTIONS) requests
app.options(/.*/, cors());

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ------------------- DATABASE -------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/infinite-spiral", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------- SCHEMAS -------------------
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    responsibilities: { type: String, default: "" },
    coverImg: { type: String, default: "" },
    extraImages: { type: [String], default: [] },
    watchUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

// ------------------- PROJECT ROUTES -------------------


// ===========================
// 2️⃣ UPDATE (PUT) project
// ===========================
app.put("/api/projects/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===========================
// 3️⃣ DELETE project
// ===========================
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const projectRouter = express.Router();

// ✅ GET all projects
projectRouter.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error("Get error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET project by ID
projectRouter.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: project });
  } catch (err) {
    console.error("Get by id error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ POST new project
projectRouter.post("/", async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Save error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ POST project with image upload
projectRouter.post("/with-image", upload.single("cover"), async (req, res) => {
  try {
    const coverUrl = req.file ? `/uploads/${req.file.filename}` : req.body.coverImg || "";
    const projectData = {
      ...req.body,
      coverImg: coverUrl,
    };
    const newProject = new Project(projectData);
    const saved = await newProject.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Save error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

app.use("/api/projects", projectRouter);

// ------------------- COMIC ROUTES -------------------
const comicSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Infinite Spiral" },
    price: { type: Number, default: 0.0 },
    description: {
      type: String,
      default:
        "Multiple worlds meet time travel in <em>Infinite Spiral</em>, my ongoing Y.A. fantasy webcomic...",
    },
    responsibilities: {
      type: String,
      default: "Writing, pencils, digital inking, coloring, and lettering.",
    },
    galleryImages: { type: [String], default: [] },
    coverSrc: {
      type: String,
      default:
        "https://daks2k3a4ib2z.cloudfront.net/55ae329911b36a52616da65a/56fdca4abca55e25190988f7_is_04_95_web.png",
    },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Comic = mongoose.model("Comic", comicSchema);
const comicRouter = express.Router();

// ✅ GET all comics
comicRouter.get("/", async (req, res) => {
  try {
    const comics = await Comic.find().sort({ createdAt: -1 });
    res.json({ success: true, data: comics });
  } catch (err) {
    console.error("Get comics error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET comic by ID
comicRouter.get("/:id", async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ success: false, message: "Comic not found" });
    }
    res.json({ success: true, data: comic });
  } catch (err) {
    console.error("Get comic by ID error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ POST comic (create new)
comicRouter.post("/", async (req, res) => {
  try {
    const { title, price, description, responsibilities, galleryImages, coverSrc, quantity } =
      req.body;

    const newComic = new Comic({
      title: title || "Untitled Comic",
      price: price || 0.0,
      description: description || "",
      responsibilities: responsibilities || "",
      galleryImages: galleryImages || [],
      coverSrc: coverSrc || "",
      quantity: quantity || 1,
    });

    const savedComic = await newComic.save();
    res.status(201).json({ success: true, data: savedComic });
  } catch (err) {
    console.error("Create comic error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ POST comic with image upload
comicRouter.post("/with-image", upload.single("cover"), async (req, res) => {
  try {
    const coverUrl = req.file ? `/uploads/${req.file.filename}` : req.body.coverSrc || "";
    const comicData = {
      title: req.body.title || "Untitled Comic",
      price: req.body.price || 0.0,
      description: req.body.description || "",
      responsibilities: req.body.responsibilities || "",
      galleryImages: req.body.galleryImages || [],
      coverSrc: coverUrl,
      quantity: req.body.quantity || 1,
    };

    const newComic = new Comic(comicData);
    const savedComic = await newComic.save();
    res.status(201).json({ success: true, data: savedComic });
  } catch (err) {
    console.error("Save comic error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ PUT update comic quantity
app.put("/api/comic/:id/quantity", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedComic = await Comic.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    if (!updatedComic) {
      return res.status(404).json({ success: false, message: "Comic not found" });
    }
    res.json({ success: true, data: updatedComic });
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Route: GET all comics
app.get("/api/comics", async (req, res) => {
  try {
    const comics = await Comic.find();
    res.json({ success: true, data: comics });
  } catch (error) {
    console.error("Error fetching comics:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
 // ------------------- backend DELETE route -------------------

comicRouter.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE route hit for ID:", req.params.id); // 👈 Add this
    const deleted = await Comic.findByIdAndDelete(req.params.id);

    if (!deleted) {
      console.log("Comic not found"); // 👈 Log
      return res
        .status(404)
        .json({ success: false, message: "Comic not found" });
    }

    console.log("Deleted comic:", deleted.id); // 👈 Log

    return res.status(200).json({
      success: true,
      message: `Comic deleted successfully`,
      data: deleted,
    });
  } catch (err) {
    console.error("Error deleting comic:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

 // ------------------- backend Update route -------------------


// PUT update
comicRouter.put("/:id", async (req, res) => {
  try {
    console.log("➡️  PUT /api/comics/" + req.params.id);
    console.log("Body:", req.body);

    const updatedComic = await Comic.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        responsibilities: req.body.responsibilities,
        quantity: req.body.quantity,
      },
      { new: true, runValidators: true }
    );

    if (!updatedComic) {
      return res
        .status(404)
        .json({ success: false, message: "Comic not found" });
    }

    res.json({
      success: true,
      message: `Comic "${updatedComic.title}" updated successfully`,
      data: updatedComic,
    });
  } catch (err) {
    console.error("❌ Error updating comic:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});



app.use("/api/comics", comicRouter);

app.use("/api/comic", comicRouter);


// ------------------- AUTH, ADMIN & CART ROUTES -------------------
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);

app.use("/api/funds", funds);
// ------------------- START SERVER -------------------
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
