import { useState, useRef, useEffect } from 'react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import PointsList from './components/PointsList';

export type Point = {
  x: number;
  y: number;
  px: number;
  py: number;
};

export type CalibrationPoint = { px: number; py: number; val: number };

export type Calibration = {
  x1: CalibrationPoint | null;
  x2: CalibrationPoint | null;
  y1: CalibrationPoint | null;
  y2: CalibrationPoint | null;
};

export type AppMode = 'IDLE' | 'CALIBRATING_X1' | 'CALIBRATING_X2' | 'CALIBRATING_Y1' | 'CALIBRATING_Y2' | 'DIGITIZING';

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [calibration, setCalibration] = useState<Calibration>({
    x1: null, x2: null, y1: null, y2: null
  });
  const [points, setPoints] = useState<Point[]>([]);
  const [mode, setMode] = useState<AppMode>('IDLE');

  // Recalculate points whenever calibration changes
  useEffect(() => {
    const { x1, x2, y1, y2 } = calibration;
    if (x1 && x2 && y1 && y2 && points.length > 0) {
      setPoints(prevPoints => {
        const updated = prevPoints.map(p => {
          const xVal = interpolate(p.px, x1.px, x2.px, x1.val, x2.val);
          const yVal = interpolate(p.py, y1.py, y2.py, y1.val, y2.val);
          if (Math.abs(xVal - p.x) < 0.000001 && Math.abs(yVal - p.y) < 0.000001) return p;
          return { ...p, x: xVal, y: yVal };
        });
        const hasChanged = updated.some((p, i) => p.x !== prevPoints[i].x || p.y !== prevPoints[i].y);
        return hasChanged ? updated : prevPoints;
      });
    }
  }, [calibration]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setPoints([]); 
          setCalibration({ x1: null, x2: null, y1: null, y2: null });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (px: number, py: number) => {
    if (mode === 'IDLE' || !image) return;

    if (mode.startsWith('CALIBRATING')) {
      const key = mode.split('_')[1].toLowerCase() as keyof Calibration;
      // We don't have the value here anymore, so we'll need to set it in Controls
      // but let's default it to the existing value if it was already set
      setCalibration(prev => ({
        ...prev,
        [key]: { px, py, val: prev[key]?.val ?? 0 }
      }));
      setMode('IDLE');
    } else if (mode === 'DIGITIZING') {
      const { x1, x2, y1, y2 } = calibration;
      if (x1 && x2 && y1 && y2) {
        const xVal = interpolate(px, x1.px, x2.px, x1.val, x2.val);
        const yVal = interpolate(py, y1.py, y2.py, y1.val, y2.val);
        setPoints(prev => [...prev, { x: xVal, y: yVal, px, py }]);
      }
    }
  };

  const interpolate = (p: number, p1: number, p2: number, v1: number, v2: number) => {
    const pixelDelta = p2 - p1;
    if (Math.abs(pixelDelta) < 0.000001) return v1;
    return v1 + (p - p1) * (v2 - v1) / pixelDelta;
  };

  return (
    <div className="app-container">
      <header>
        <h1>Plot Digitizer</h1>
      </header>
      <main className="main-content">
        <aside className="sidebar">
          <section className="upload-section">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </section>
          
          {image && (
            <Controls 
              calibration={calibration} 
              setCalibration={setCalibration} 
              mode={mode} 
              setMode={setMode} 
              onClearPoints={() => setPoints([])}
            />
          )}

          <PointsList points={points} setPoints={setPoints} />
        </aside>

        <section className="canvas-area">
          {image ? (
            <Canvas 
              image={image} 
              mode={mode} 
              calibration={calibration}
              points={points}
              onCanvasClick={handleCanvasClick}
              setCalibration={setCalibration}
              setMode={setMode}
            />
          ) : (
            <div className="placeholder">Please upload an image to start</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
