import { Calibration, AppMode } from '../App';

interface ControlsProps {
  calibration: Calibration;
  setCalibration: React.Dispatch<React.SetStateAction<Calibration>>;
  mode: AppMode;
  setMode: React.Dispatch<React.SetStateAction<AppMode>>;
  onClearPoints: () => void;
}

const Controls = ({ calibration, setCalibration, mode, setMode, onClearPoints }: ControlsProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof Calibration;
    const val = parseFloat(e.target.value) || 0;
    
    setCalibration(prev => ({
      ...prev,
      [key]: prev[key] ? { ...prev[key]!, val } : { px: 0, py: 0, val }
    }));
  };

  const startCalibrating = (pointMode: AppMode) => {
    setMode(pointMode);
  };

  const isCalibrated = calibration.x1 && calibration.x2 && calibration.y1 && calibration.y2;

  return (
    <section className="controls">
      <h2>Calibration</h2>
      <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
        1. Enter axis limits.<br />
        2. Click 'Pick' and then click the corresponding point on the plot.
      </p>
      
      <div className="control-group">
        <label>X1 Value:</label>
        <input name="x1" type="number" value={calibration.x1?.val ?? 0} onChange={handleInputChange} />
        <button 
          className={`btn ${mode === 'CALIBRATING_X1' ? 'btn-active' : 'btn-secondary'}`}
          onClick={() => startCalibrating('CALIBRATING_X1')}
        >
          {calibration.x1 ? 'Reset X1' : 'Pick X1'}
        </button>
      </div>

      <div className="control-group">
        <label>X2 Value:</label>
        <input name="x2" type="number" value={calibration.x2?.val ?? 100} onChange={handleInputChange} />
        <button 
          className={`btn ${mode === 'CALIBRATING_X2' ? 'btn-active' : 'btn-secondary'}`}
          onClick={() => startCalibrating('CALIBRATING_X2')}
        >
          {calibration.x2 ? 'Reset X2' : 'Pick X2'}
        </button>
      </div>

      <div className="control-group">
        <label>Y1 Value:</label>
        <input name="y1" type="number" value={calibration.y1?.val ?? 0} onChange={handleInputChange} />
        <button 
          className={`btn ${mode === 'CALIBRATING_Y1' ? 'btn-active' : 'btn-secondary'}`}
          onClick={() => startCalibrating('CALIBRATING_Y1')}
        >
          {calibration.y1 ? 'Reset Y1' : 'Pick Y1'}
        </button>
      </div>

      <div className="control-group">
        <label>Y2 Value:</label>
        <input name="y2" type="number" value={calibration.y2?.val ?? 100} onChange={handleInputChange} />
        <button 
          className={`btn ${mode === 'CALIBRATING_Y2' ? 'btn-active' : 'btn-secondary'}`}
          onClick={() => startCalibrating('CALIBRATING_Y2')}
        >
          {calibration.y2 ? 'Reset Y2' : 'Pick Y2'}
        </button>
      </div>

      <div className="mode-toggle">
        <button 
          className={`btn btn-primary ${mode === 'DIGITIZING' ? 'btn-active' : ''}`}
          disabled={!isCalibrated}
          onClick={() => setMode('DIGITIZING')}
        >
          Start Digitizing
        </button>
        <button className="btn btn-secondary" onClick={onClearPoints}>Clear Points</button>
      </div>

      {!isCalibrated && <p style={{ fontSize: '0.8rem', color: '#e67e22', marginTop: '0.5rem' }}>Complete all 4 calibration points.</p>}
    </section>
  );
};

export default Controls;
