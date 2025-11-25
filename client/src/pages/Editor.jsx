import React, { useState } from 'react';
import { Layers, Type, Image, Palette, Grid, Layout, Download, Save, Undo, Redo, ZoomIn, ZoomOut, Crop, RotateCw, Trash2, Copy, Eye, EyeOff, Lock, Unlock, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Upload, Sliders, Wand2, Droplet, Sun, Moon, Contrast, Filter, Scissors, FlipHorizontal, FlipVertical, Move, MousePointer, Square, Circle, Minus, Plus, ChevronDown, X, Check, Star, Heart, Smile, Crown, ArrowLeft } from 'lucide-react';

const MattyProEditor = () => {
  const [activePanel, setActivePanel] = useState('templates');
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState('select');

  const layers = [
    { id: 1, name: 'Background', type: 'fill', visible: true, locked: false, opacity: 100 },
    { id: 2, name: 'Photo 1', type: 'image', visible: true, locked: false, opacity: 100 },
    { id: 3, name: 'Overlay', type: 'shape', visible: true, locked: false, opacity: 80 },
    { id: 4, name: 'Title Text', type: 'text', visible: true, locked: false, opacity: 100 }
  ];

  const collageLayouts = [
    { name: '2 Photos', grid: '1x2', icon: '▢▢' },
    { name: '3 Photos', grid: '1x3', icon: '▢▢▢' },
    { name: '4 Grid', grid: '2x2', icon: '▦' },
    { name: '6 Grid', grid: '2x3', icon: '▦▦' },
    { name: '9 Grid', grid: '3x3', icon: '▦▦▦' },
    { name: 'Heart', shape: 'heart', icon: '♥' },
    { name: 'Circle', shape: 'circle', icon: '●' },
    { name: 'Custom', shape: 'custom', icon: '✨' }
  ];

  const filters = [
    { name: 'Original', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Vibrant', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Cool', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Warm', preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Vintage', preview: 'linear-gradient(135deg, #bc8f8f 0%, #d2b48c 100%)' },
    { name: 'B&W', preview: 'linear-gradient(135deg, #000000 0%, #ffffff 100%)' },
    { name: 'Sepia', preview: 'linear-gradient(135deg, #704214 0%, #daa520 100%)' },
    { name: 'Sunset', preview: 'linear-gradient(135deg, #ff6b6b 0%, #ffe66d 100%)' }
  ];

  const effects = [
    { name: 'Blur', icon: '🌫️', type: 'blur' },
    { name: 'Sharpen', icon: '✨', type: 'sharpen' },
    { name: 'Glow', icon: '💡', type: 'glow' },
    { name: 'Shadow', icon: '🌑', type: 'shadow' },
    { name: 'Vignette', icon: '⚫', type: 'vignette' },
    { name: 'Grain', icon: '📺', type: 'grain' },
    { name: 'Bokeh', icon: '✨', type: 'bokeh' },
    { name: 'Glitch', icon: '⚡', type: 'glitch' }
  ];

  const backgrounds = [
    { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { type: 'gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { type: 'gradient', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { type: 'gradient', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { type: 'gradient', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { type: 'gradient', value: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { type: 'solid', value: '#FFFFFF' },
    { type: 'solid', value: '#000000' }
  ];

  const textPresets = [
    { name: 'Heading', size: 64, weight: 'bold', font: 'Inter' },
    { name: 'Subheading', size: 48, weight: '600', font: 'Inter' },
    { name: 'Body', size: 32, weight: 'normal', font: 'Inter' },
    { name: 'Caption', size: 24, weight: 'normal', font: 'Inter' }
  ];

  const shapes = [
    { name: 'Rectangle', icon: Square },
    { name: 'Circle', icon: Circle },
    { name: 'Line', icon: Minus },
    { name: 'Arrow', icon: ArrowLeft }
  ];

  const stickers = ['😀', '❤️', '⭐', '🎉', '👍', '💯', '🔥', '✨', '💪', '🎨', '📷', '🎵'];

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Left Toolbar */}
      <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2">
        <button
          onClick={() => setActiveTool('select')}
          className={`p-3 rounded-lg transition ${activeTool === 'select' ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'}`}
          title="Select"
        >
          <MousePointer className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTool('crop')}
          className={`p-3 rounded-lg transition ${activeTool === 'crop' ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'}`}
          title="Crop"
        >
          <Crop className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTool('text')}
          className={`p-3 rounded-lg transition ${activeTool === 'text' ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'}`}
          title="Text"
        >
          <Type className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTool('shape')}
          className={`p-3 rounded-lg transition ${activeTool === 'shape' ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'}`}
          title="Shapes"
        >
          <Square className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTool('draw')}
          className={`p-3 rounded-lg transition ${activeTool === 'draw' ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100'}`}
          title="Draw"
        >
          <Palette className="w-5 h-5" />
        </button>
        
        <label className="p-3 hover:bg-slate-100 rounded-lg cursor-pointer transition" title="Upload">
          <Upload className="w-5 h-5" />
          <input type="file" className="hidden" accept="image/*" />
        </label>

        <div className="flex-1"></div>

        <button className="p-3 hover:bg-slate-100 rounded-lg transition" title="Undo">
          <Undo className="w-5 h-5" />
        </button>
        
        <button className="p-3 hover:bg-slate-100 rounded-lg transition" title="Redo">
          <Redo className="w-5 h-5" />
        </button>
      </div>

      {/* Left Panel */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActivePanel('templates')}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition ${
                activePanel === 'templates' ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActivePanel('layers')}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition ${
                activePanel === 'layers' ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1" />
              Layers
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activePanel === 'templates' && (
            <div className="space-y-6">
              {/* Collage Layouts */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Grid className="w-5 h-5 text-purple-600" />
                  Collage Layouts
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {collageLayouts.map((layout, idx) => (
                    <button
                      key={idx}
                      className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition text-center border-2 border-transparent hover:border-purple-500"
                    >
                      <div className="text-3xl mb-2">{layout.icon}</div>
                      <div className="text-xs font-semibold text-slate-700">{layout.name}</div>
                      <div className="text-xs text-slate-500">{layout.grid || layout.shape}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-bold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                    🖼️ Remove Background (AI)
                  </button>
                  <button className="w-full p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                    ✨ Smart Enhance
                  </button>
                  <button className="w-full p-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                    🎨 Auto Color Correct
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'layers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Layers</h3>
                <button className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedLayer === layer.id ? 'bg-purple-50 border-2 border-purple-500' : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {layer.type === 'image' && <Image className="w-4 h-4 text-blue-600" />}
                      {layer.type === 'text' && <Type className="w-4 h-4 text-green-600" />}
                      {layer.type === 'shape' && <Square className="w-4 h-4 text-orange-600" />}
                      {layer.type === 'fill' && <Palette className="w-4 h-4 text-purple-600" />}
                      <span className="font-semibold text-sm">{layer.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-white rounded">
                        {layer.visible ? <Eye className="w-4 h-4 text-slate-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                      </button>
                      <button className="p-1 hover:bg-white rounded">
                        {layer.locked ? <Lock className="w-4 h-4 text-slate-600" /> : <Unlock className="w-4 h-4 text-slate-400" />}
                      </button>
                      <button className="p-1 hover:bg-white rounded text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Opacity</span>
                    <input type="range" min="0" max="100" value={layer.opacity} className="flex-1" />
                    <span className="text-xs text-slate-600 font-mono">{layer.opacity}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col bg-slate-100">
        {/* Top Toolbar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button className="text-slate-600 hover:text-slate-900 font-semibold">
              Untitled Design
            </button>
            <div className="flex items-center gap-2 ml-4">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-mono bg-slate-100 px-3 py-1 rounded">{zoom}%</span>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Pro
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="bg-white rounded-lg shadow-2xl" style={{ width: '800px', height: '800px' }}>
            <div className="w-full h-full bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-lg flex items-center justify-center border-2 border-slate-200">
              <div className="text-center text-slate-400">
                <Grid className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <div className="text-xl font-semibold mb-2">Your Design Canvas</div>
                <div className="text-sm">Drag and drop images or select a template</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-lg mb-4">Design Tools</h3>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Filters */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-600" />
              Filters
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {filters.map((filter, idx) => (
                <button
                  key={idx}
                  className="aspect-square rounded-lg hover:ring-2 ring-purple-500 transition"
                  style={{ background: filter.preview }}
                  title={filter.name}
                />
              ))}
            </div>
          </div>

          {/* Effects */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-600" />
              Effects
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {effects.map((effect, idx) => (
                <button
                  key={idx}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition text-center border-2 border-transparent hover:border-purple-500"
                >
                  <div className="text-2xl mb-1">{effect.icon}</div>
                  <div className="text-xs font-semibold">{effect.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Adjustments */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" />
              Adjustments
            </h4>
            <div className="space-y-3">
              {[
                { name: 'Brightness', icon: Sun },
                { name: 'Contrast', icon: Contrast },
                { name: 'Saturation', icon: Droplet },
                { name: 'Temperature', icon: Sun }
              ].map((adj, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <adj.icon className="w-4 h-4" />
                      {adj.name}
                    </span>
                    <span className="text-slate-500 font-mono">0</span>
                  </div>
                  <input type="range" min="-100" max="100" defaultValue="0" className="w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Backgrounds */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Layout className="w-5 h-5 text-purple-600" />
              Backgrounds
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {backgrounds.map((bg, idx) => (
                <button
                  key={idx}
                  className="aspect-square rounded-lg hover:ring-2 ring-purple-500 transition"
                  style={{ background: bg.value }}
                />
              ))}
            </div>
          </div>

          {/* Stickers */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Smile className="w-5 h-5 text-purple-600" />
              Stickers & Emojis
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {stickers.map((sticker, idx) => (
                <button
                  key={idx}
                  className="aspect-square bg-slate-50 hover:bg-slate-100 rounded-lg transition text-2xl flex items-center justify-center"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>

          {/* Text Styles */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Type className="w-5 h-5 text-purple-600" />
              Text Styles
            </h4>
            <div className="space-y-2">
              {textPresets.map((preset, idx) => (
                <button
                  key={idx}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition"
                >
                  <div style={{ fontSize: `${preset.size / 4}px`, fontWeight: preset.weight }}>
                    {preset.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{preset.font} · {preset.size}px</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MattyProEditor;