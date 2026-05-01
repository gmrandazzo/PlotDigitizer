import { Point } from '../App';

interface PointsListProps {
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
}

const PointsList = ({ points, setPoints }: PointsListProps) => {
  const exportToCSV = () => {
    if (points.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + "X,Y,PixelX,PixelY\n"
      + points.map(p => `${p.x},${p.y},${p.px},${p.py}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "digitized_points.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removePoint = (index: number) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  return (
    <section className="points-list">
      <h2>Digitized Points ({points.length})</h2>
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
        <table className="points-table">
          <thead>
            <tr>
              <th>X</th>
              <th>Y</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={i}>
                <td>{p.x.toFixed(4)}</td>
                <td>{p.y.toFixed(4)}</td>
                <td>
                  <button onClick={() => removePoint(i)} style={{ padding: '2px 5px' }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="export-section">
        <button className="btn btn-primary" onClick={exportToCSV} disabled={points.length === 0}>
          Export CSV
        </button>
      </div>
    </section>
  );
};

export default PointsList;
