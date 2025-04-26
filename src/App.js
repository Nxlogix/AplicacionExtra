import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/login';
import Registro from './components/register';
import ProductosView from './components/ProductosView';
import ProtectedRoute from './components/ProtectedRoute'; // Importamos la ruta protegida
import './App.css'; // Asegúrate de que este archivo contenga las clases definidas

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1 className="app-title">Mi Aplicación Web</h1>
          <nav className="app-nav">
            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
            <Link to="/register" className="nav-link">Registrarse</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />
            {/* Ruta protegida para UsuariosList */}
            <Route
              path="/productos"
              element={
                <ProtectedRoute>
                  <ProductosView />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;