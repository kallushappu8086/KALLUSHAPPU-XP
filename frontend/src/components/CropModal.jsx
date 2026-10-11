import { useState, useRef, useEffect } from 'react';

export default function CropModal({ file, onCrop, onClose }) {
  const [imgSrc, setImgSrc] = useState('');
  const isGif = file ? (file.type === 'image/gif' || file.name.endsWith('.gif')) : false;
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Crop box state (percentages relative to the display size)
  const [crop, setCrop] = useState({ x: 10, y: 10, w: 80, h: 45 }); // Default 16:9 box
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, cropX: 0, cropY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, cropW: 0, cropH: 0 });

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleImageLoad = () => {
    if (!imageRef.current) return;
    const { width, height } = imageRef.current.getBoundingClientRect();
    
    // Initialize 16:9 crop box based on image dimensions
    let w = 80;
    let h = (w * (9/16)) * (width / height);
    if (h > 90) {
      h = 80;
      w = (h * (16/9)) * (height / width);
    }
    
    setCrop({
      x: (100 - w) / 2,
      y: (100 - h) / 2,
      w,
      h
    });
  };

  // Drag handlers
  const startDrag = (e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragStart.current = {
      x: clientX,
      y: clientY,
      cropX: crop.x,
      cropY: crop.y
    };
    setDragging(true);
  };

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    resizeStart.current = {
      x: clientX,
      y: clientY,
      cropW: crop.w,
      cropH: crop.h
    };
    setResizing(true);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (dragging) {
        const dx = ((clientX - dragStart.current.x) / rect.width) * 100;
        const dy = ((clientY - dragStart.current.y) / rect.height) * 100;
        
        let newX = Math.max(0, Math.min(100 - crop.w, dragStart.current.cropX + dx));
        let newY = Math.max(0, Math.min(100 - crop.h, dragStart.current.cropY + dy));
        
        setCrop(prev => ({ ...prev, x: newX, y: newY }));
      } else if (resizing) {
        const dx = ((clientX - resizeStart.current.x) / rect.width) * 100;
        
        let newW = Math.max(20, Math.min(100 - crop.x, resizeStart.current.cropW + dx));
        // Enforce 16:9 aspect ratio relative to actual image dimensions
        const imgAspect = rect.width / rect.height;
        let newH = (newW * (9 / 16)) * imgAspect;
        
        if (crop.y + newH > 100) {
          newH = 100 - crop.y;
          newW = (newH * (16 / 9)) / imgAspect;
        }

        setCrop(prev => ({ ...prev, w: newW, h: newH }));
      }
    };

    const handleEnd = () => {
      setDragging(false);
      setResizing(false);
    };

    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragging, resizing, crop]);

  const handleApply = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    
    // Calculate coordinates relative to the natural image size
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    const cropX = (crop.x / 100) * naturalWidth;
    const cropY = (crop.y / 100) * naturalHeight;
    const cropWidth = (crop.w / 100) * naturalWidth;
    const cropHeight = (crop.h / 100) * naturalHeight;

    onCrop({
      file,
      cropX,
      cropY,
      cropWidth,
      cropHeight
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 5, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '650px',
        padding: '24px',
        border: '1px solid rgba(37, 99, 235, 0.2)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>
            Crop Background Image {isGif && '(GIF Mode)'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Drag and resize the crop box. A 16:9 aspect ratio is enforced automatically to ensure the welcome card aligns perfectly on Discord.
          </p>
        </div>

        {/* Cropping Area */}
        <div 
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '350px',
            backgroundColor: '#03020a',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {imgSrc && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                ref={imageRef}
                src={imgSrc} 
                alt="crop source" 
                onLoad={handleImageLoad}
                style={{
                  maxHeight: '350px',
                  maxWidth: '100%',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
              
              {/* Semi-transparent dark overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                pointerEvents: 'none'
              }} />

              {/* Crop Cutout Box */}
              <div 
                style={{
                  position: 'absolute',
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.w}%`,
                  height: `${crop.h}%`,
                  border: '2px solid var(--primary)',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.4), 0 0 15px rgba(37, 99, 235, 0.5)',
                  cursor: 'move'
                }}
                onMouseDown={startDrag}
                onTouchStart={startDrag}
              >
                {/* Visual grid inside crop box */}
                <div style={{ position: 'absolute', inset: 0, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                
                {/* Resize Handle */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    width: '14px',
                    height: '14px',
                    backgroundColor: 'var(--primary)',
                    border: '2px solid white',
                    borderRadius: '50%',
                    cursor: 'se-resize',
                    zIndex: 10
                  }}
                  onMouseDown={startResize}
                  onTouchStart={startResize}
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleApply} 
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
