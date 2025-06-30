"use client"
import { useEffect, useRef, useState } from 'react';
import { inter, domine } from "../app/fonts"
import { removeBackground } from "@imgly/background-removal"

// Simple Dropzone component
const Dropzone = ({ setSelectedImage }: { setSelectedImage: (file?: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedImage(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedImage(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
        }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <div className="text-4xl mb-4">📁</div>
      <p className="text-lg font-medium mb-2">Upload your image</p>
      <p className="text-gray-500">Drag & drop or click to browse</p>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default function ThumbnailCreate() {
  const [imagesrc, setimagesrc] = useState<string | null>(null);
  const canva = useRef<HTMLCanvasElement>(null)
  const [processedimagesrc, setprocessedimagesrc] = useState<string | null>(null);
  const [canvasReady, setcanvasReady] = useState(false)
  const [text, setText] = useState("POV")
  const [textColor, setTextColor] = useState("#000000");
  const [isProcessing, setIsProcessing] = useState(false);
  const [Font, setFont] = useState<string>("Arial")

  const setSelectImage = (file?: File) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async (e) => {
        const src = e.target?.result;
        setimagesrc(src as string);
        const blob = await removeBackground(src)
        const processedurl = URL.createObjectURL(blob)
        setprocessedimagesrc(processedurl)
        setcanvasReady(true)
      };
    }
  };
  const drawcomposite = () => {
    if (!canva.current || !canvasReady || !imagesrc || !processedimagesrc) return;
    const ctx = canva.current.getContext('2d')
    if (!ctx) return
    const canvas = canva.current;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let font = 100;
      let select = "Arial";
      switch (Font) {
        case "inter":
          select = inter.style.fontFamily;
          break;
        case "domine":
          select = domine.style.fontFamily;
          break;
      }
      ctx.font = `${"bold"} ${font}px ${select}`;
      const textfont = ctx.measureText(text).width;
      const target = canvas.width * 0.9;
      font *= target / textfont;
      ctx.font = `${"bold"} ${font}px ${select}`;
      ctx.fillStyle = "black";
      ctx.globalAlpha = 1;
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      ctx.translate(x, y);
      ctx.fillText(text, 0, 0);
      ctx.restore();
      const fgimg = new Image();
      fgimg.onload = () => {
        ctx.drawImage(fgimg, 0, 0, canvas.width, canvas.height);
      }
      fgimg.src = processedimagesrc;
    }
    img.src = imagesrc;
  }
  const handledownload = () => {
    if (canva.current) {
      const link = document.createElement("a");
      link.download = "image.jpg";
      link.href = canva.current.toDataURL();
      link.click();
    }
  }

  useEffect(() => {
    if (canvasReady) {
      drawcomposite()
    }
  }, [canvasReady])

  const resetApp = () => {
    setimagesrc(null);
    setprocessedimagesrc(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✨ Thumbnail Creator
          </h1>
          <p className="text-gray-600">Create amazing thumbnails in seconds</p>
        </div>

        {imagesrc ? (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={resetApp}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              ← Back
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Canvas Preview */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                {isProcessing ? (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p>Processing image...</p>
                    </div>
                  </div>
                ) : (
                  <canvas
                    ref={canva}
                    className="w-full max-w-md mx-auto rounded-lg shadow"
                  />
                )}
              </div>

              {/* Controls */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Customize</h3>

                <div className="space-y-4">
                  {/* Text Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Text</label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your text"
                    />
                  </div>

                  {/* Font Select */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Font</label>
                    <select
                      value={Font}
                      onChange={(e) => setFont(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="arial">Arial</option>
                      <option value="inter">Inter</option>
                      <option value="domine">Domine</option>
                    </select>
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Text Color</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 border rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={drawcomposite}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      🔄 Update
                    </button>
                    <button
                      onClick={handledownload}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6">
                🚀 Let's create something amazing!
              </h2>
              <Dropzone setSelectedImage={setSelectImage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function setImageSrc(arg0: null) {
  throw new Error('Function not implemented.');
}
function setIsProcessing(arg0: boolean) {
  throw new Error('Function not implemented.');
}

