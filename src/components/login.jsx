import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('https://3.93.215.212/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Credenciales inválidas. Revisa el email y la contraseña.');
        } else {
          throw new Error('Hubo un problema en el servidor.');
        }
      }

      const data = await response.json();
      setMensaje('¡Inicio de sesión exitoso!');
      localStorage.setItem('access_token', data.access_token);
      navigate('/productos');
    } catch (error) {
      console.error('Error:', error);
      setMensaje(error.message);
    }
  };

  return (
    <div>
      <h2>Inicio de Sesión</h2>
      {mensaje && (
        <p style={{ color: mensaje.includes('exitoso') ? 'green' : 'red' }}>
          {mensaje}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;