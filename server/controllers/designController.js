import Design from "../models/Design.js";

export const saveDesign = async (req, res) => {
  try {
    const { title, jsonData, thumbnailUrl } = req.body;
    const design = await Design.create({ userId: req.user, title, jsonData, thumbnailUrl });
    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.user });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDesign = async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: "Design deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
