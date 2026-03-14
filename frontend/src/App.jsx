import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <DashboardLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage setLatestResult={setLatestResult} />} />
        <Route path="/results" element={<ResultsPage latestResult={latestResult} />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
