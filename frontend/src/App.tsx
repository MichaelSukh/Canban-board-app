import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TestPage } from "./pages/TestPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<TestPage />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<div className="flex items-center justify-center text-5xl font-mono">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
