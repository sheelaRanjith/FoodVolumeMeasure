import { useMemo } from 'react';
import { Alert, Badge, Button, Card, Col, Row, Table } from 'react-bootstrap';
import { jsPDF } from 'jspdf';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function ResultsPage({ latestResult }) {
  const processedImageUrl = useMemo(() => {
    if (!latestResult?.processed_image) return '';
    return `${API_BASE}${latestResult.processed_image}`;
  }, [latestResult]);

  const downloadReportPdf = () => {
    if (!latestResult) return;

    const pdf = new jsPDF();
    let y = 16;

    pdf.setFontSize(16);
    pdf.text('Food Volume Measurement Report', 14, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.text(`Generated At: ${new Date().toLocaleString()}`, 14, y);
    y += 8;
    pdf.text(`Primary Food: ${latestResult.detected_food || 'Unknown'}`, 14, y);
    y += 8;
    pdf.text(`Total Volume: ${latestResult.volume} cm^3`, 14, y);
    y += 8;
    pdf.text(`Estimated Calories: ${latestResult.calories} kcal`, 14, y);
    y += 12;

    pdf.setFontSize(12);
    pdf.text('Detected Items', 14, y);
    y += 8;

    const items = latestResult.items || [];
    if (!items.length) {
      pdf.setFontSize(11);
      pdf.text('No food items were detected.', 14, y);
    } else {
      pdf.setFontSize(10);
      items.forEach((item, index) => {
        const line = `${index + 1}. ${item.food} | Confidence: ${(item.confidence * 100).toFixed(1)}% | Volume: ${item.volume} cm^3 | Calories: ${item.calories} kcal`;
        const lines = pdf.splitTextToSize(line, 180);
        pdf.text(lines, 14, y);
        y += lines.length * 6;
        if (y > 275) {
          pdf.addPage();
          y = 16;
        }
      });
    }

    pdf.save(`food-analysis-${Date.now()}.pdf`);
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
            <Button onClick={downloadReportPdf}>Download Result Report (PDF)</Button>
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
