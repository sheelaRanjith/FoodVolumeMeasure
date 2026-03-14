import { useEffect, useState } from 'react';
import { Alert, Card, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/history`);
        setHistory(response.data.history || []);
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'Could not load history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <Card.Title>Detection History</Card.Title>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <Table responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Food</th>
                <th>Volume (cm³)</th>
                <th>Calories (kcal)</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry._id}>
                  <td>{new Date(entry.created_at).toLocaleString()}</td>
                  <td>{entry.detected_food}</td>
                  <td>{entry.volume}</td>
                  <td>{entry.calories}</td>
                  <td>{entry.items?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default HistoryPage;
