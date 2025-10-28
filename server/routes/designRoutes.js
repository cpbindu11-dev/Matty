import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveDesign, getDesigns, deleteDesign } from "../controllers/designController.js";

const router = express.Router();

router.post("/", protect, saveDesign);
router.get("/", protect, getDesigns);
router.delete("/:id", protect, deleteDesign);

export default router;
