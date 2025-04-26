import React, { useState } from 'react';
import './login.css';

const Registro = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.password) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }

    fetch('https://3.84.162.25/usuarios/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setMensaje(data.error);
        } else {
          setMensaje('¡Registro exitoso!');
          setForm({ nombre: '', email: '', password: '' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMensaje('Hubo un problema con el registro.');
      });
  };

  return (
    <div>
      <h2>Formulario de Registro</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
          <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Registrar</button>
      </form>
    </div>
  );
};

export default Registro;