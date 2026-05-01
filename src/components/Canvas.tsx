import { useRef, useEffect, MouseEvent } from 'react';
import { AppMode, Calibration, Point } from '../App';

interface CanvasProps {
  image: HTMLImageElement;
  mode: AppMode;
  calibration: Calibration;
  points: Point[];
  onCanvasClick: (px: number, py: number) => void;
  setCalibration: React.Dispatch<React.SetStateAction<Calibration>>;
  setMode: React.Dispatch<React.SetStateAction<AppMode>>;
}

const Canvas = ({ image, mode, calibration, points, onCanvasClick, setCalibration, setMode }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    draw();
  }, [image, mode, calibration, points]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    // Draw Calibration Lines and Markers
    if (calibration.x1) drawCalibrationLine(ctx, calibration.x1.px, calibration.x1.py, 'vertical', `X1: ${calibration.x1.val}`, '#e74c3c');
    if (calibration.x2) drawCalibrationLine(ctx, calibration.x2.px, calibration.x2.py, 'vertical', `X2: ${calibration.x2.val}`, '#e74c3c');
    if (calibration.y1) drawCalibrationLine(ctx, calibration.y1.px, calibration.y1.py, 'horizontal', `Y1: ${calibration.y1.val}`, '#e67e22');
    if (calibration.y2) drawCalibrationLine(ctx, calibration.y2.px, calibration.y2.py, 'horizontal', `Y2: ${calibration.y2.val}`, '#e67e22');

    // Draw Digitized Points
    points.forEach((p, i) => {
      drawMarker(ctx, p.px, p.py, '#2ecc71', (i + 1).toString());
    });
  };

  const drawCalibrationLine = (ctx: CanvasRenderingContext2D, px: number, py: number, orientation: 'horizontal' | 'vertical', label: string, color: string) => {
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    if (orientation === 'vertical') {
      ctx.moveTo(px, 0);
      ctx.lineTo(px, image.height);
    } else {
      ctx.moveTo(0, py);
      ctx.lineTo(image.width, py);
    }
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    drawMarker(ctx, px, py, color, label);
  };

  const drawMarker = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 14px Arial';
    ctx.strokeText(label, x + 8, y + 8);
    ctx.fillText(label, x + 8, y + 8);
  };

  const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Crucial: Calculate based on current CSS scaling of the canvas
    const scaleX = image.width / rect.width;
    const scaleY = image.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;

    onCanvasClick(px, py);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas 
        ref={canvasRef} 
        onClick={handleClick}
        style={{ 
          cursor: mode === 'IDLE' ? 'default' : 'crosshair' 
        }}
      />
    </div>
  );
};

export default Canvas;
