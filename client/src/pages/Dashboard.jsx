import { useEffect, useState } from "react";
import { 
  Box, Button, Typography, Paper, Grid, Card, CardMedia, CardContent, 
  CardActions, IconButton, CircularProgress, Container, Chip, Tabs, Tab,
  InputAdornment, TextField, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { 
  Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon,
  Instagram, Facebook, Twitter, YouTube, TrendingUp, Search,
  VideoLibrary, Image as ImageIcon, Close
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const TEMPLATE_CATEGORIES = [
  { name: "All", icon: "🎨" },
  { name: "Social Media", icon: "📱" },
  { name: "Popular", icon: "🔥" },
  { name: "Business", icon: "💼" },
  { name: "Video Templates", icon: "🎬" }
];

const PRESET_TEMPLATES = [
  {
    id: "social-1",
    title: "Instagram Post - Summer Vibes",
    category: "Social Media",
    type: "image",
    width: 1080,
    height: 1080,
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop",
    elements: [
      { type: "background", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&h=1080&fit=crop" },
      { type: "text", content: "SUMMER VIBES", position: "top", style: { fontSize: 60, color: "#fff", fontWeight: "bold" } },
      { type: "sticker", emoji: "☀️", position: "bottom-right" }
    ],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    popular: true
  },
  {
    id: "social-2",
    title: "Instagram Story - Quote",
    category: "Social Media",
    type: "image",
    width: 1080,
    height: 1920,
    thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=600&fit=crop",
    elements: [
      { type: "background", color: "#FFA500" },
      { type: "image", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop", position: "center" },
      { type: "text", content: "Be Yourself", position: "bottom", style: { fontSize: 48, color: "#fff" } },
      { type: "sticker", emoji: "✨", position: "top-left" }
    ],
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    popular: true
  },
  {
    id: "social-3",
    title: "Facebook Cover - Business",
    category: "Social Media",
    type: "image",
    width: 1200,
    height: 630,
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
    elements: [
      { type: "background", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop" },
      { type: "overlay", color: "rgba(0,0,0,0.4)" },
      { type: "text", content: "YOUR BRAND", position: "center", style: { fontSize: 72, color: "#fff", fontWeight: "bold" } }
    ],
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    popular: false
  },
  {
    id: "video-1",
    title: "YouTube Intro - Tech Channel",
    category: "Video Templates",
    type: "video",
    width: 1920,
    height: 1080,
    duration: 5,
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    elements: [
      { type: "background", video: "tech-bg.mp4", color: "#000" },
      { type: "text", content: "TECH REVIEWS", animation: "fadeIn", position: "center" },
      { type: "audio", track: "intro-music.mp3", volume: 0.7 }
    ],
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    popular: true
  },
  {
    id: "video-2",
    title: "Instagram Reel - Product Launch",
    category: "Video Templates",
    type: "video",
    width: 1080,
    height: 1920,
    duration: 15,
    thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=600&fit=crop",
    elements: [
      { type: "background", gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
      { type: "text", content: "NEW PRODUCT", animation: "slideUp", position: "center" },
      { type: "sticker", emoji: "🚀", animation: "bounce" },
      { type: "audio", track: "upbeat.mp3", volume: 0.8 }
    ],
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    popular: true
  },
  {
    id: "video-3",
    title: "TikTok Video - Dance Challenge",
    category: "Video Templates",
    type: "video",
    width: 1080,
    height: 1920,
    duration: 30,
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=600&fit=crop",
    elements: [
      { type: "background", color: "#FF0050" },
      { type: "text", content: "#DanceChallenge", animation: "pulse", position: "top" },
      { type: "sticker", emoji: "💃", animation: "spin" },
      { type: "audio", track: "dance-music.mp3", volume: 1.0 }
    ],
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    popular: true
  },
  {
    id: "popular-1",
    title: "YouTube Thumbnail - Gaming",
    category: "Popular",
    type: "image",
    width: 1280,
    height: 720,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    elements: [
      { type: "background", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop" },
      { type: "overlay", gradient: "linear-gradient(to right, rgba(255,0,0,0.7), transparent)" },
      { type: "text", content: "EPIC GAMEPLAY", position: "left", style: { fontSize: 64, color: "#fff", fontWeight: "bold" } },
      { type: "sticker", emoji: "🎮", position: "bottom-right" }
    ],
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    popular: true
  },
  {
    id: "business-1",
    title: "Business Presentation Slide",
    category: "Business",
    type: "image",
    width: 1920,
    height: 1080,
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
    elements: [
      { type: "background", color: "#FFFFFF" },
      { type: "shape", form: "rectangle", color: "#667eea", position: "left" },
      { type: "text", content: "Q4 Results", position: "right", style: { fontSize: 52, color: "#333" } },
      { type: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", position: "bottom-right" }
    ],
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    popular: false
  }
];

const STICKER_PACKS = [
  { category: "Emojis", stickers: ["😀", "❤️", "🔥", "✨", "🎉", "👍", "💯", "🚀", "⭐", "💪"] },
  { category: "Social", stickers: ["📱", "💬", "📷", "🎥", "🎵", "👥", "🌐", "📧", "📞", "💌"] },
  { category: "Business", stickers: ["💼", "📊", "💰", "📈", "🎯", "⚡", "🏆", "💡", "📅", "✅"] },
  { category: "Nature", stickers: ["🌸", "🌺", "🌻", "🌷", "🌹", "🍃", "🌿", "☀️", "🌙", "⭐"] }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDialog, setPreviewDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await API.get("/designs");
      setDesigns(response.data);
    } catch (error) {
      console.error("Error fetching designs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;
    
    try {
      await API.delete(`/designs/${id}`);
      setDesigns(designs.filter(d => d._id !== id));
    } catch (error) {
      console.error("Error deleting design:", error);
      alert("Failed to delete design");
    }
  };

  const filteredTemplates = PRESET_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openPreview = (template) => {
    setSelectedTemplate(template);
    setPreviewDialog(true);
  };

  const handleUseTemplate = (template) => {
    if (template.type === "video") {
      navigate(`/video-editor?template=${template.id}`);
    } else {
      navigate(`/editor?template=${template.id}`);
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800,
              background: "linear-gradient(45deg, #fff, #f0f0f0)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              textShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}
          >
            Matty Design Studio
          </Typography>
          <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 300, mb: 4 }}>
            Create stunning images & videos in minutes
          </Typography>

          <TextField
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 400 },
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                "&.Mui-focused fieldset": { borderColor: "white" }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "white" }} />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Category Tabs */}
        <Paper sx={{ 
          mb: 4, 
          borderRadius: 3,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
        }}>
          <Tabs
            value={selectedCategory}
            onChange={(e, v) => setSelectedCategory(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": { 
                color: "rgba(255,255,255,0.7)",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none"
              },
              "& .Mui-selected": { color: "white !important" },
              "& .MuiTabs-indicator": { backgroundColor: "white", height: 3, borderRadius: 3 }
            }}
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <Tab key={cat.name} label={`${cat.icon} ${cat.name}`} value={cat.name} />
            ))}
          </Tabs>
        </Paper>

        {/* Templates Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    background: "rgba(255,255,255,0.2)"
                  }
                }}
                onClick={() => openPreview(template)}
              >
                <Box sx={{ position: "relative", paddingTop: "75%" }}>
                  <CardMedia
                    component="img"
                    image={template.thumbnail}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  {template.type === "video" && (
                    <Chip
                      icon={<VideoLibrary />}
                      label="Video"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "linear-gradient(45deg, #FF0050, #FF6B6B)",
                        color: "white",
                        fontWeight: 600
                      }}
                    />
                  )}
                  {template.popular && (
                    <Chip
                      icon={<TrendingUp />}
                      label="Popular"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "linear-gradient(45deg, #FF6B6B, #FFE66D)",
                        color: "white",
                        fontWeight: 600
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.5)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                      "&:hover": { opacity: 1 }
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template);
                      }}
                      sx={{
                        background: "white",
                        color: "#667eea",
                        fontWeight: 700,
                        px: 4,
                        "&:hover": { background: "white", transform: "scale(1.05)" }
                      }}
                    >
                      Use Template
                    </Button>
                  </Box>
                </Box>
                <CardContent sx={{ color: "white" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {template.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {template.width} × {template.height}px
                    {template.duration && ` • ${template.duration}s`}
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {template.elements.slice(0, 3).map((el, idx) => (
                      <Chip
                        key={idx}
                        label={el.type}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.65rem",
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white"
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Create Your Own - Big CTA */}
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "white", mb: 2 }}>
              ✨ Create Your Own Design
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 300, mb: 4 }}>
              Start from scratch with our powerful image & video editor
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/editor")}
                startIcon={<ImageIcon />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  "&:hover": { transform: "scale(1.05)" }
                }}
              >
                Image Editor
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/video-editor")}
                startIcon={<VideoLibrary />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #FF6B6B, #FFE66D)",
                  "&:hover": { transform: "scale(1.05)" }
                }}
              >
                Video Editor
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* My Designs Section */}
        {designs.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700, mb: 3 }}>
              📁 My Designs
            </Typography>
            <Grid container spacing={3}>
              {designs.map((design) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={design._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={design.thumbnailUrl || "https://via.placeholder.com/300x200"}
                      alt={design.title}
                    />
                    <CardContent sx={{ color: "white" }}>
                      <Typography variant="h6" noWrap>{design.title}</Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        {new Date(design.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton sx={{ color: "white" }} onClick={() => navigate(`/editor?id=${design._id}`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton sx={{ color: "#FF6B6B" }} onClick={() => handleDelete(design._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Template Preview Dialog */}
      <Dialog 
        open={previewDialog} 
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">{selectedTemplate?.title}</Typography>
          <IconButton onClick={() => setPreviewDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <img 
                src={selectedTemplate.thumbnail} 
                alt={selectedTemplate.title}
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
              <Typography variant="body1" gutterBottom>
                <strong>Type:</strong> {selectedTemplate.type === "video" ? "Video Template" : "Image Template"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Dimensions:</strong> {selectedTemplate.width} × {selectedTemplate.height}px
              </Typography>
              {selectedTemplate.duration && (
                <Typography variant="body1" gutterBottom>
                  <strong>Duration:</strong> {selectedTemplate.duration} seconds
                </Typography>
              )}
              <Typography variant="body1" gutterBottom>
                <strong>Includes:</strong>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {selectedTemplate.elements.map((el, idx) => (
                  <Chip key={idx} label={el.type} color="primary" size="small" />
                ))}
              </Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleUseTemplate(selectedTemplate)}
                sx={{ mt: 2, py: 1.5, fontWeight: 700 }}
              >
                Use This Template
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}