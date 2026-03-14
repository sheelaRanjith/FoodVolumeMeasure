import { Card, Col, Row } from 'react-bootstrap';

function HomePage() {
  const highlights = [
    'Upload or capture food image from camera',
    'YOLOv8-powered multi-food detection with confidence scores',
    'OpenCV-based volume approximation using bounding boxes',
    'Automatic calorie estimation and MongoDB history tracking'
  ];

  return (
    <div>
      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title className="fs-3">Welcome</Card.Title>
              <Card.Text>
                This dashboard estimates food volume in cm³ and calories from images using computer vision.
              </Card.Text>
              <ul className="ps-3">
                {highlights.map((item) => (
                  <li key={item} className="mb-2">{item}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100 bg-primary text-white">
            <Card.Body>
              <Card.Title>Quick Start</Card.Title>
              <Card.Text>
                Navigate to <strong>Upload / Capture Food</strong> to process an image and view results.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
