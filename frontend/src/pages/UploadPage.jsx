import { useRef, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function UploadPage({ setLatestResult }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [stream, setStream] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError('');
    } catch (cameraError) {
      setError('Unable to access camera. Please allow permission or use file upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      setPreviewUrl(URL.createObjectURL(blob));
      await processImage(blob, true);
    }, 'image/jpeg');
  };

  const processImage = async (fileOrBlob = selectedFile, fromCamera = false) => {
    if (!fileOrBlob) {
      setError('Please upload or capture an image first.');
      return;
    }
    setProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', fileOrBlob, fromCamera ? 'captured.jpg' : fileOrBlob.name);
      const endpoint = fromCamera ? '/capture' : '/upload';
      const response = await axios.post(`${API_URL}${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLatestResult(response.data);
      navigate('/results');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Image processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Row className="g-4">
      <Col lg={6}>
        <Card className="shadow-sm border-0 h-100">
          <Card.Body>
            <Card.Title>Upload Food Image</Card.Title>
            <Form.Group>
              <Form.Control type="file" accept="image/*" onChange={handleFile} />
            </Form.Group>
            <Button className="mt-3" onClick={() => processImage()} disabled={processing || !selectedFile}>
              Process Uploaded Image
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={6}>
        <Card className="shadow-sm border-0 h-100">
          <Card.Body>
            <Card.Title>Capture with Camera</Card.Title>
            <div className="camera-box rounded border mb-3">
              <video ref={videoRef} autoPlay playsInline className="w-100 rounded" />
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="outline-primary" onClick={startCamera}>Start Camera</Button>
              <Button variant="outline-danger" onClick={stopCamera}>Stop Camera</Button>
              <Button onClick={captureImage} disabled={!stream || processing}>Capture & Process</Button>
            </div>
            <canvas ref={canvasRef} className="d-none" />
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12}>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Card.Title>Image Preview</Card.Title>
            {previewUrl ? <img src={previewUrl} alt="Preview" className="img-preview rounded" /> : <p className="text-muted mb-0">No image selected.</p>}
            {processing && (
              <div className="d-flex align-items-center gap-2 mt-3">
                <Spinner animation="border" size="sm" />
                <span>Running detection and volume estimation...</span>
              </div>
            )}
            {error && <Alert variant="danger" className="mt-3 mb-0">{error}</Alert>}
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12}>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Card.Title>Detection Outputs</Card.Title>
            <Table responsive size="sm">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Multiple food detection</td><td>Enabled</td></tr>
                <tr><td>Confidence score display</td><td>Enabled</td></tr>
                <tr><td>History persistence</td><td>Enabled</td></tr>
                <tr><td>Download report</td><td>Enabled in Results page</td></tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default UploadPage;
