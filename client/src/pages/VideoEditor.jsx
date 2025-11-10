import { useEffect, useRef, useState } from "react";
import { 
  Box, Button, TextField, Paper, Stack, Typography, Divider,
  Slider, Grid, IconButton, Tabs, Tab, Card, Chip, Select,
  MenuItem, FormControl, InputLabel, List, ListItem, ListItemText,
  ListItemIcon, Switch, FormControlLabel, Alert
} from "@mui/material";
import { 
  PlayArrow, Pause, Stop, VolumeUp, Videocam, MusicNote,
  Add, Delete, ContentCut, Splitscreen,
  TextFields, Image as ImageIcon, Download, Save
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../utils/api";

const VIDEO_EFFECTS = [
  { name: "None", value: "none" },
  { name: "Fade In", value: "fadeIn" },
  { name: "Fade Out", value: "fadeOut" },
  { name: "Zoom In", value: "zoomIn" },
  { name: "Zoom Out", value: "zoomOut" },
  { name: "Slide Left", value: "slideLeft" },
  { name: "Slide Right", value: "slideRight" },
  { name: "Blur", value: "blur" },
  { name: "Brightness", value: "brightness" }
];

const MUSIC_LIBRARY = [
  { id: 1, name: "Upbeat Energy", duration: "2:30", genre: "Pop", url: "/music/upbeat.mp3" },
  { id: 2, name: "Chill Vibes", duration: "3:15", genre: "Lo-fi", url: "/music/chill.mp3" },
  { id: 3, name: "Epic Cinematic", duration: "2:45", genre: "Orchestral", url: "/music/epic.mp3" },
  { id: 4, name: "Tech House", duration: "3:00", genre: "Electronic", url: "/music/tech.mp3" },
  { id: 5, name: "Acoustic Guitar", duration: "2:20", genre: "Acoustic", url: "/music/acoustic.mp3" },
  { id: 6, name: "Hip Hop Beat", duration: "2:50", genre: "Hip Hop", url: "/music/hiphop.mp3" }
];

const TRANSITIONS = [
  { name: "Cut", value: "cut", icon: "✂️" },
  { name: "Fade", value: "fade", icon: "🌫️" },
  { name: "Dissolve", value: "dissolve", icon: "💫" },
  { name: "Wipe", value: "wipe", icon: "↔️" },
  { name: "Slide", value: "slide", icon: "➡️" }
];

export default function VideoEditor() {
  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [projectName, setProjectName] = useState("Untitled Video");
  const [currentTab, setCurrentTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isRecording] = useState(false);
  const [trimStart] = useState(0);
  const [trimEnd] = useState(0);
  
  // Video clips
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  
  // Audio
  const [audioTracks, setAudioTracks] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioVolume, setAudioVolume] = useState(50);
  
  // Text overlays
  const [textOverlays, setTextOverlays] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState("center");
  const [textSize, setTextSize] = useState(32);
  const [textColor, setTextColor] = useState("#FFFFFF");
  
  // Effects
  const [selectedEffect, setSelectedEffect] = useState("none");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  
  // Transitions
  const [selectedTransition, setSelectedTransition] = useState("cut");

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      loadVideoTemplate(templateId);
    }
  }, [searchParams]);

  const loadVideoTemplate = (templateId) => {
    const VIDEO_TEMPLATES = [
      {
        id: "video-1",
        title: "YouTube Intro - Tech Channel",
        textOverlays: [
          { id: 1, text: "TECH REVIEWS", position: "center", size: 48, color: "#FFFFFF", startTime: 0, duration: 5 }
        ],
        audioTracks: [
          { id: 1, name: "Epic Cinematic", duration: "2:45", genre: "Orchestral", url: "/music/epic.mp3", startTime: 0, volume: 70 }
        ]
      },
      {
        id: "video-2",
        title: "Instagram Reel - Product Launch",
        textOverlays: [
          { id: 1, text: "NEW PRODUCT", position: "center", size: 42, color: "#FFFFFF", startTime: 0, duration: 15 }
        ],
        audioTracks: [
          { id: 1, name: "Upbeat Energy", duration: "2:30", genre: "Pop", url: "/music/upbeat.mp3", startTime: 0, volume: 80 }
        ]
      },
      {
        id: "video-3",
        title: "TikTok Video - Dance Challenge",
        textOverlays: [
          { id: 1, text: "#DanceChallenge", position: "top", size: 36, color: "#FFFFFF", startTime: 0, duration: 30 }
        ],
        audioTracks: [
          { id: 1, name: "Hip Hop Beat", duration: "2:50", genre: "Hip Hop", url: "/music/hiphop.mp3", startTime: 0, volume: 100 }
        ]
      }
    ];

    const template = VIDEO_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setProjectName(template.title);
      setTextOverlays(template.textOverlays);
      setAudioTracks(template.audioTracks);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    const newClip = {
      id: Date.now(),
      name: file.name,
      url: url,
      duration: 0,
      startTime: clips.length > 0 ? clips[clips.length - 1].startTime + clips[clips.length - 1].duration : 0,
      effects: [],
      transition: "cut"
    };
    
    setClips([...clips, newClip]);
    
    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.onloadedmetadata = () => {
        newClip.duration = videoRef.current.duration;
        setDuration(videoRef.current.duration);
      };
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    const newClip = {
      id: Date.now(),
      name: file.name,
      url: url,
      type: "image",
      duration: 5, // Default 5 seconds for images
      startTime: clips.length > 0 ? clips[clips.length - 1].startTime + clips[clips.length - 1].duration : 0,
      effects: [],
      transition: "fade"
    };
    
    setClips([...clips, newClip]);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (e, value) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
    }
  };

  const handleSpeedChange = (e, value) => {
    setPlaybackSpeed(value);
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const addMusicTrack = (music) => {
    const newTrack = {
      id: Date.now(),
      ...music,
      startTime: 0,
      volume: audioVolume
    };
    setAudioTracks([...audioTracks, newTrack]);
    setSelectedAudio(newTrack);
  };

  const removeMusicTrack = (id) => {
    setAudioTracks(audioTracks.filter(track => track.id !== id));
    if (selectedAudio?.id === id) setSelectedAudio(null);
  };

  const addTextOverlay = () => {
    if (!textInput.trim()) return;
    
    const newText = {
      id: Date.now(),
      text: textInput,
      position: textPosition,
      size: textSize,
      color: textColor,
      startTime: currentTime,
      duration: 3,
      animation: "fadeIn"
    };
    
    setTextOverlays([...textOverlays, newText]);
    setTextInput("");
  };

  const removeTextOverlay = (id) => {
    setTextOverlays(textOverlays.filter(text => text.id !== id));
  };

  const deleteClip = (id) => {
    setClips(clips.filter(clip => clip.id !== id));
    if (selectedClip?.id === id) setSelectedClip(null);
  };

  const applyEffectToClip = () => {
    if (!selectedClip) return;
    
    const updatedClips = clips.map(clip => {
      if (clip.id === selectedClip.id) {
        return { ...clip, effects: [...clip.effects, selectedEffect] };
      }
      return clip;
    });
    
    setClips(updatedClips);
  };

  const splitClip = () => {
    if (!selectedClip) {
      alert("Please select a clip first!");
      return;
    }
    alert("✂️ Split feature: Select a clip and use this to split at current time");
  };

  const trimClip = () => {
    if (!selectedClip) {
      alert("Please select a clip first!");
      return;
    }
    alert("✅ Trim feature: Adjust start and end points to trim your clip");
  };

  const mergeClips = () => {
    if (clips.length < 2) {
      alert("Need at least 2 clips to merge!");
      return;
    }
    alert("🎬 All clips will be merged into one!");
  };

  const duplicateClip = () => {
    if (!selectedClip) {
      alert("Please select a clip first!");
      return;
    }
    
    const duplicate = {
      ...selectedClip,
      id: Date.now(),
      name: `${selectedClip.name} (Copy)`,
      startTime: clips.length > 0 ? clips[clips.length - 1].startTime + clips[clips.length - 1].duration : 0
    };
    
    setClips([...clips, duplicate]);
    alert("✅ Clip duplicated!");
  };

  const exportVideo = () => {
    const exportData = {
      projectName,
      clips,
      audioTracks,
      textOverlays,
      effects: {
        brightness,
        contrast,
        saturation,
        playbackSpeed
      },
      resolution: "1080p",
      format: "mp4"
    };
    
    console.log("Exporting video with data:", exportData);
    
    // In production, this would call a backend API with FFmpeg
    alert(`📹 Video export initiated!\n\nProject: ${projectName}\nClips: ${clips.length}\nAudio Tracks: ${audioTracks.length}\nText Overlays: ${textOverlays.length}\n\nNote: Full export requires backend FFmpeg integration.`);
  };

  const saveProject = async () => {
    try {
      const projectData = {
        title: projectName,
        clips: clips,
        audioTracks: audioTracks,
        textOverlays: textOverlays,
        settings: {
          playbackSpeed,
          brightness,
          contrast,
          saturation
        }
      };
      
      await API.post("/video-projects", projectData);
      alert("✅ Video project saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("❌ Failed to save project");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}>
      {/* Sidebar */}
      <Paper sx={{ width: 350, overflowY: "auto", background: "rgba(255,255,255,0.95)" }}>
        <Box sx={{ p: 2, background: "linear-gradient(135deg, #1e3c72, #2a5298)", color: "white" }}>
          <Button size="small" onClick={() => navigate("/dashboard")} sx={{ color: "white", mb: 1 }}>
            ← Back
          </Button>
          <TextField
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" }
              }
            }}
          />
        </Box>

        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} variant="fullWidth">
          <Tab label="🎬 Media" />
          <Tab label="🎵 Audio" />
          <Tab label="✨ Effects" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {/* MEDIA TAB */}
          {currentTab === 0 && (
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Media Library</Typography>
              
              {searchParams.get('template') && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Template loaded! Add your videos and customize.
                </Alert>
              )}
              
              <input
                type="file"
                accept="video/*"
                id="video-upload"
                style={{ display: "none" }}
                onChange={handleVideoUpload}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={() => document.getElementById("video-upload").click()}
                startIcon={<Videocam />}
                sx={{ background: "linear-gradient(45deg, #1e3c72, #2a5298)", py: 1.5 }}
              >
                Upload Video
              </Button>

              <input
                type="file"
                accept="image/*"
                id="image-upload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={() => document.getElementById("image-upload").click()}
                startIcon={<ImageIcon />}
              >
                Add Image
              </Button>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Clips ({clips.length})</Typography>
              <List sx={{ maxHeight: 300, overflow: "auto" }}>
                {clips.map((clip, idx) => (
                  <ListItem
                    key={clip.id}
                    sx={{
                      bgcolor: selectedClip?.id === clip.id ? "rgba(30,60,114,0.1)" : "transparent",
                      borderRadius: 1,
                      mb: 1,
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedClip(clip)}
                  >
                    <ListItemIcon>
                      <Chip label={idx + 1} size="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={clip.name}
                      secondary={`${clip.duration.toFixed(1)}s`}
                    />
                    <IconButton onClick={() => deleteClip(clip.id)} size="small">
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Video Tools</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={splitClip}
                    disabled={!selectedClip}
                    startIcon={<ContentCut />}
                  >
                    Split
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={duplicateClip}
                    disabled={!selectedClip}
                    startIcon={<Add />}
                  >
                    Duplicate
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={mergeClips}
                    disabled={clips.length < 2}
                    startIcon={<Splitscreen />}
                  >
                    Merge All Clips
                  </Button>
                </Grid>
              </Grid>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Text Overlays</Typography>
              <TextField
                fullWidth
                label="Text Content"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                size="small"
              />
              
              <FormControl fullWidth size="small">
                <InputLabel>Position</InputLabel>
                <Select value={textPosition} onChange={(e) => setTextPosition(e.target.value)} label="Position">
                  <MenuItem value="top">Top</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="bottom">Bottom</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography variant="caption">Font Size: {textSize}px</Typography>
                <Slider value={textSize} onChange={(e, v) => setTextSize(v)} min={16} max={80} />
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={addTextOverlay}
                disabled={!textInput.trim()}
                startIcon={<TextFields />}
              >
                Add Text
              </Button>

              <List sx={{ maxHeight: 200, overflow: "auto" }}>
                {textOverlays.map((text) => (
                  <ListItem key={text.id}>
                    <ListItemText primary={text.text} secondary={text.position} />
                    <IconButton onClick={() => removeTextOverlay(text.id)} size="small">
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Transitions</Typography>
              <Grid container spacing={1}>
                {TRANSITIONS.map((trans) => (
                  <Grid item xs={4} key={trans.value}>
                    <Button
                      fullWidth
                      variant={selectedTransition === trans.value ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setSelectedTransition(trans.value)}
                    >
                      {trans.icon} {trans.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )}

          {/* AUDIO TAB */}
          {currentTab === 1 && (
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Music Library</Typography>
              
              <Box>
                <Typography variant="caption">Audio Volume: {audioVolume}%</Typography>
                <Slider value={audioVolume} onChange={(e, v) => setAudioVolume(v)} />
              </Box>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Available Tracks</Typography>
              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {MUSIC_LIBRARY.map((music) => (
                  <ListItem key={music.id}>
                    <ListItemIcon>
                      <MusicNote color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={music.name}
                      secondary={`${music.genre} • ${music.duration}`}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => addMusicTrack(music)}
                      startIcon={<Add />}
                    >
                      Add
                    </Button>
                  </ListItem>
                ))}
              </List>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Added Tracks</Typography>
              <List>
                {audioTracks.map((track) => (
                  <ListItem key={track.id}>
                    <ListItemText primary={track.name} secondary={`Volume: ${track.volume}%`} />
                    <IconButton onClick={() => removeMusicTrack(track.id)} size="small">
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Stack>
          )}

          {/* EFFECTS TAB */}
          {currentTab === 2 && (
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Video Effects</Typography>
              
              <FormControl fullWidth size="small">
                <InputLabel>Effect</InputLabel>
                <Select value={selectedEffect} onChange={(e) => setSelectedEffect(e.target.value)} label="Effect">
                  {VIDEO_EFFECTS.map((effect) => (
                    <MenuItem key={effect.value} value={effect.value}>{effect.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                onClick={applyEffectToClip}
                disabled={!selectedClip}
              >
                Apply Effect to Selected Clip
              </Button>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Playback Speed</Typography>
              <Box>
                <Typography variant="caption">Speed: {playbackSpeed}x</Typography>
                <Slider
                  value={playbackSpeed}
                  onChange={handleSpeedChange}
                  min={0.25}
                  max={2}
                  step={0.25}
                  marks
                />
              </Box>

              <Divider />

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Color Adjustments</Typography>
              
              <Box>
                <Typography variant="caption">Brightness: {brightness}%</Typography>
                <Slider value={brightness} onChange={(e, v) => setBrightness(v)} min={0} max={200} />
              </Box>

              <Box>
                <Typography variant="caption">Contrast: {contrast}%</Typography>
                <Slider value={contrast} onChange={(e, v) => setContrast(v)} min={0} max={200} />
              </Box>

              <Box>
                <Typography variant="caption">Saturation: {saturation}%</Typography>
                <Slider value={saturation} onChange={(e, v) => setSaturation(v)} min={0} max={200} />
              </Box>
            </Stack>
          )}
        </Box>

        {/* Bottom Actions */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", bgcolor: "#f5f5f5" }}>
          <Stack spacing={1}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={saveProject}
              startIcon={<Save />}
              sx={{ py: 1.5 }}
            >
              Save Project
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={exportVideo}
              startIcon={<Download />}
            >
              Export Video
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Main Video Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
        {/* Video Player */}
        <Paper
          elevation={10}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            borderRadius: 3,
            overflow: "hidden",
            mb: 2,
            position: "relative"
          }}
        >
          <video
            ref={videoRef}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
            }}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            onEnded={() => setIsPlaying(false)}
          />
          
          {textOverlays.map((text) => (
            <Box
              key={text.id}
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: text.position === "top" ? "10%" : text.position === "center" ? "50%" : "auto",
                bottom: text.position === "bottom" ? "10%" : "auto",
                fontSize: text.size,
                color: text.color,
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                pointerEvents: "none"
              }}
            >
              {text.text}
            </Box>
          ))}
        </Paper>

        {/* Controls */}
        <Paper sx={{ p: 2, borderRadius: 3, background: "rgba(255,255,255,0.95)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <IconButton
              onClick={togglePlayPause}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" }
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={handleStop}>
              <Stop />
            </IconButton>
            
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ minWidth: 50 }}>
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
              </Typography>
              <Slider
                value={currentTime}
                max={duration}
                onChange={(e, v) => {
                  if (videoRef.current) videoRef.current.currentTime = v;
                }}
                sx={{ flex: 1 }}
              />
              <Typography variant="caption" sx={{ minWidth: 50 }}>
                {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 150 }}>
              <VolumeUp />
              <Slider value={volume} onChange={handleVolumeChange} sx={{ width: 100 }} />
            </Box>
          </Box>

          {/* Timeline */}
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="caption" sx={{ mb: 1, display: "block" }}>Timeline</Typography>
            <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
              {clips.map((clip, idx) => (
                <Chip
                  key={clip.id}
                  label={`Clip ${idx + 1}`}
                  onClick={() => setSelectedClip(clip)}
                  color={selectedClip?.id === clip.id ? "primary" : "default"}
                  sx={{ minWidth: 80 }}
                />
              ))}
            </Box>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
}