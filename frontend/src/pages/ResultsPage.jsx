import { useMemo } from 'react';
import { Alert, Badge, Button, Card, Col, Row, Table } from 'react-bootstrap';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function ResultsPage({ latestResult }) {
  const processedImageUrl = useMemo(() => {
    if (!latestResult?.processed_image) return '';
    return `${API_BASE}${latestResult.processed_image}`;
  }, [latestResult]);

  const downloadReport = () => {
    if (!latestResult) return;
    const report = {
      generated_at: new Date().toISOString(),
      ...latestResult
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `food-analysis-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!latestResult) {
    return <Alert variant="info">No result available yet. Process an image first.</Alert>;
  }

  return (
    <Row className="g-4">
      <Col lg={6}>
        <Card className="shadow-sm border-0 h-100">
          <Card.Body>
            <Card.Title>Processed Detection Image</Card.Title>
            <img src={processedImageUrl} alt="Processed detection" className="img-preview rounded" />
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6}>
        <Card className="shadow-sm border-0 h-100">
          <Card.Body>
            <Card.Title>Result Summary</Card.Title>
            <p><strong>Primary Food:</strong> {latestResult.detected_food}</p>
            <p><strong>Total Volume:</strong> {latestResult.volume} cm³</p>
            <p><strong>Estimated Calories:</strong> {latestResult.calories} kcal</p>
            <Button onClick={downloadReport}>Download Result Report</Button>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12}>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Card.Title>Detected Items (Multiple Support)</Card.Title>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Food</th>
                  <th>Confidence</th>
                  <th>Volume (cm³)</th>
                  <th>Calories (kcal)</th>
                </tr>
              </thead>
              <tbody>
                {latestResult.items?.map((item, index) => (
                  <tr key={`${item.food}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.food}</td>
                    <td><Badge bg="secondary">{(item.confidence * 100).toFixed(1)}%</Badge></td>
                    <td>{item.volume}</td>
                    <td>{item.calories}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default ResultsPage;
