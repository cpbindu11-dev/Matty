import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { 
  Box, Button, TextField, Paper, Stack, ButtonGroup, Typography, Divider,
  Select, MenuItem, FormControl, InputLabel, Slider, Grid, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { 
  Circle, Square, Star, Crop169, ChangeHistory, Hexagon
} from "@mui/icons-material";
import API from "../utils/api";

const COLORS = [
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#3F51B5" },
  { name: "Green", value: "#4CAF50" },
  { name: "Yellow", value: "#FFEB3B" },
  { name: "Purple", value: "#9C27B0" },
  { name: "Orange", value: "#FF9800" },
  { name: "Pink", value: "#E91E63" },
  { name: "Cyan", value: "#00BCD4" },
  { name: "Lime", value: "#CDDC39" },
  { name: "Indigo", value: "#3F51B5" },
  { name: "Teal", value: "#009688" },
  { name: "Brown", value: "#795548" },
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#9E9E9E" }
];

const FONTS = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Comic Sans MS",
  "Impact",
  "Palatino",
  "Garamond",
  "Bookman",
  "Trebuchet MS",
  "Arial Black"
];

export default function Editor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [designTitle, setDesignTitle] = useState("Untitled Design");
  const fileInputRef = useRef(null);
  
  // Style states
  const [fillColor, setFillColor] = useState("#3F51B5");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Arial");

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff"
    });
    
    setCanvas(fabricCanvas);

    // Update controls when object is selected
    fabricCanvas.on('selection:created', updateControlsFromSelection);
    fabricCanvas.on('selection:updated', updateControlsFromSelection);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const updateControlsFromSelection = (e) => {
    const obj = e.selected[0];
    if (obj) {
      if (obj.fill) setFillColor(obj.fill);
      if (obj.stroke) setStrokeColor(obj.stroke);
      if (obj.strokeWidth) setStrokeWidth(obj.strokeWidth);
      if (obj.fontSize) setFontSize(obj.fontSize);
      if (obj.fontFamily) setFontFamily(obj.fontFamily);
    }
  };

  const addRect = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: fillColor,
      width: 150,
      height: 100,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      fill: fillColor,
      radius: 75,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addTriangle = () => {
    if (!canvas) return;
    const triangle = new fabric.Triangle({
      left: 150,
      top: 150,
      fill: fillColor,
      width: 150,
      height: 130,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    });
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
  };

  const addLine = () => {
    if (!canvas) return;
    const line = new fabric.Line([50, 100, 200, 100], {
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      selectable: true
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  const addStar = () => {
    if (!canvas) return;
    const points = [];
    const innerRadius = 30;
    const outerRadius = 70;
    
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }
    
    const star = new fabric.Polygon(points, {
      left: 150,
      top: 150,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    });
    canvas.add(star);
    canvas.setActiveObject(star);
    canvas.renderAll();
  };

  const addHexagon = () => {
    if (!canvas) return;
    const points = [];
    const radius = 60;
    
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }
    
    const hexagon = new fabric.Polygon(points, {
      left: 150,
      top: 150,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    });
    canvas.add(hexagon);
    canvas.setActiveObject(hexagon);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas || !textInput.trim()) return;
    const text = new fabric.Text(textInput, {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fill: fillColor,
      fontFamily: fontFamily
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setTextInput("");
  };

  const handleImageUpload = (e) => {
    if (!canvas) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.set({
          left: 50,
          top: 50,
          scaleX: 0.5,
          scaleY: 0.5
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const updateSelectedObject = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.type === 'text') {
        activeObject.set({
          fill: fillColor,
          fontSize: fontSize,
          fontFamily: fontFamily
        });
      } else {
        activeObject.set({
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth
        });
      }
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (!canvas) return;
    if (window.confirm("Clear entire canvas?")) {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";
      canvas.renderAll();
    }
  };

  const saveDesign = async () => {
    if (!canvas) return;
    try {
      const jsonData = canvas.toJSON();
      const thumbnailUrl = canvas.toDataURL({
        format: "png",
        quality: 0.8
      });

      await API.post("/designs", {
        title: designTitle,
        jsonData,
        thumbnailUrl
      });
      alert("✅ Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      alert("❌ Failed to save design: " + (error.response?.data?.message || error.message));
    }
  };

  const exportPNG = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2
    });
    const link = document.createElement("a");
    link.download = `${designTitle}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJPG = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "jpeg",
      quality: 0.9,
      multiplier: 2
    });
    const link = document.createElement("a");
    link.download = `${designTitle}.jpg`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
      <Paper sx={{ width: 320, p: 2, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>🎨 Design Tools</Typography>
        
        <TextField
          fullWidth
          label="Design Title"
          value={designTitle}
          onChange={(e) => setDesignTitle(e.target.value)}
          sx={{ mb: 2 }}
          size="small"
        />

        <Divider sx={{ my: 2 }} />

        {/* Color Palette */}
        <Typography variant="subtitle2" gutterBottom>Fill Color</Typography>
        <Grid container spacing={0.5} sx={{ mb: 2 }}>
          {COLORS.map((color) => (
            <Grid item xs={2.4} key={color.value}>
              <Box
                onClick={() => setFillColor(color.value)}
                sx={{
                  width: "100%",
                  height: 35,
                  bgcolor: color.value,
                  border: fillColor === color.value ? "3px solid #000" : "1px solid #ddd",
                  cursor: "pointer",
                  borderRadius: 1,
                  "&:hover": { transform: "scale(1.1)" },
                  transition: "all 0.2s"
                }}
                title={color.name}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle2" gutterBottom>Stroke Color</Typography>
        <Grid container spacing={0.5} sx={{ mb: 2 }}>
          {COLORS.slice(0, 10).map((color) => (
            <Grid item xs={2.4} key={color.value}>
              <Box
                onClick={() => setStrokeColor(color.value)}
                sx={{
                  width: "100%",
                  height: 30,
                  bgcolor: color.value,
                  border: strokeColor === color.value ? "3px solid #000" : "1px solid #ddd",
                  cursor: "pointer",
                  borderRadius: 1
                }}
                title={color.name}
              />
            </Grid>
          ))}
        </Grid>

        {/* Stroke Width */}
        <Typography variant="subtitle2" gutterBottom>Stroke Width: {strokeWidth}px</Typography>
        <Slider
          value={strokeWidth}
          onChange={(e, val) => setStrokeWidth(val)}
          min={0}
          max={20}
          step={1}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />

        {/* Shapes */}
        <Typography variant="subtitle2" gutterBottom>Add Shapes</Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={addRect} fullWidth size="small">
              <Square sx={{ mr: 0.5 }} fontSize="small" /> Rect
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={addCircle} fullWidth size="small">
              <Circle sx={{ mr: 0.5 }} fontSize="small" /> Circle
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={addTriangle} fullWidth size="small">
              <ChangeHistory sx={{ mr: 0.5 }} fontSize="small" /> Tri
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={addStar} fullWidth size="small">
              <Star sx={{ mr: 0.5 }} fontSize="small" /> Star
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={addHexagon} fullWidth size="small">
              <Hexagon sx={{ mr: 0.5 }} fontSize="small" /> Hex
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined" onClick={addLine} fullWidth size="small">
              <Crop169 sx={{ mr: 0.5 }} fontSize="small" /> Line
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Text Tools */}
        <Typography variant="subtitle2" gutterBottom>Add Text</Typography>
        
        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
          <InputLabel>Font Family</InputLabel>
          <Select
            value={fontFamily}
            label="Font Family"
            onChange={(e) => setFontFamily(e.target.value)}
          >
            {FONTS.map((font) => (
              <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="caption" gutterBottom>Font Size: {fontSize}px</Typography>
        <Slider
          value={fontSize}
          onChange={(e, val) => setFontSize(val)}
          min={12}
          max={120}
          step={2}
          sx={{ mb: 1 }}
        />

        <TextField
          fullWidth
          label="Enter Text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addText()}
          size="small"
          sx={{ mb: 1 }}
        />
        <Button 
          fullWidth 
          variant="contained" 
          onClick={addText} 
          disabled={!textInput.trim()}
          size="small"
        >
          📝 Add Text
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* Image Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <Button 
          variant="contained" 
          onClick={() => fileInputRef.current.click()}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        >
          🖼️ Upload Image
        </Button>

        {/* Update Selected */}
        <Button 
          variant="outlined" 
          color="info" 
          onClick={updateSelectedObject}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        >
          🎨 Apply Style to Selected
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Typography variant="subtitle2" gutterBottom>Actions</Typography>
        <Stack spacing={1}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={deleteSelected}
            fullWidth
            size="small"
          >
            🗑️ Delete Selected
          </Button>

          <Button 
            variant="outlined" 
            color="warning" 
            onClick={clearCanvas}
            fullWidth
            size="small"
          >
            🧹 Clear Canvas
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Save & Export */}
        <Typography variant="subtitle2" gutterBottom>Save & Export</Typography>
        <ButtonGroup orientation="vertical" fullWidth size="small">
          <Button variant="contained" color="success" onClick={saveDesign}>
            💾 Save to Cloud
          </Button>
          <Button variant="contained" color="primary" onClick={exportPNG}>
            📥 Export PNG
          </Button>
          <Button variant="contained" color="secondary" onClick={exportJPG}>
            📥 Export JPG
          </Button>
        </ButtonGroup>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          💡 Select an object and change colors/styles, then click "Apply Style"
        </Typography>
      </Paper>

      {/* Canvas Area */}
      <Box sx={{ 
        flex: 1, 
        bgcolor: "#f0f0f0", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        p: 2
      }}>
        <Box sx={{ 
          boxShadow: 3,
          border: "1px solid #ddd"
        }}>
          <canvas ref={canvasRef} />
        </Box>
      </Box>
    </Box>
  );
}