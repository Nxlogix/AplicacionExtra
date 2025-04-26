import React, { useState, useEffect } from "react";

const ProductosView = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [filtro, setFiltro] = useState(""); // Estado para buscar productos por nombre o categoría
  const [formProducto, setFormProducto] = useState({
    nombre: "",
    precio: "",
    cantidad: "",
    categoriaId: "",
  });
  const [formCategoria, setFormCategoria] = useState({
    nombre: "",
    descripcion: "",
  });
  const [productoEditado, setProductoEditado] = useState(null); // Estado para el producto en edición

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const responseProductos = await fetch("https://3.84.162.25/productos/productos");
        const responseCategorias = await fetch("https://3.84.162.25/productos/categorias");
        const productosData = await responseProductos.json();
        const categoriasData = await responseCategorias.json();
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (error) {
        setMensaje("Error al cargar los datos");
        console.error("Error:", error);
      }
    };
    fetchDatos();
  }, []);

  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setFormProducto({ ...formProducto, [name]: value.trim() });
  };

  const handleCategoriaChange = (e) => {
    const { name, value } = e.target;
    setFormCategoria({ ...formCategoria, [name]: value.trim() });
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    producto.categoria.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const agregarProducto = async (e) => {
    e.preventDefault();

    if (!formProducto.nombre || !formProducto.precio || !formProducto.cantidad || !formProducto.categoriaId) {
      setMensaje("Por favor, completa todos los campos del producto.");
      return;
    }

    const productoData = {
      nombre: formProducto.nombre,
      precio: parseFloat(formProducto.precio),
      cantidad: parseInt(formProducto.cantidad, 10),
      categoria_id: parseInt(formProducto.categoriaId, 10),
    };

    try {
      const response = await fetch("https://3.84.162.25/productos/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData),
      });
      const data = await response.json();

      if (data.error) {
        setMensaje(data.error);
      } else {
        setMensaje("¡Producto agregado exitosamente!");
        setFormProducto({ nombre: "", precio: "", cantidad: "", categoriaId: "" });
        setProductos((prev) => [...prev, data]);
      }
    } catch (error) {
      setMensaje("Error al agregar el producto.");
      console.error("Error:", error);
    }
  };

  const editarProducto = async (e) => {
    e.preventDefault();

    if (!formProducto.nombre || !formProducto.precio || !formProducto.cantidad || !formProducto.categoriaId) {
      setMensaje("Por favor, completa todos los campos del producto.");
      return;
    }

    const productoData = {
      nombre: formProducto.nombre,
      precio: parseFloat(formProducto.precio),
      cantidad: parseInt(formProducto.cantidad, 10),
      categoria_id: parseInt(formProducto.categoriaId, 10),
    };

    try {
      const response = await fetch(`https://3.84.162.25/productos/productos/${productoEditado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData),
      });
      const data = await response.json();

      if (data.error) {
        setMensaje(data.error);
      } else {
        setMensaje("¡Producto actualizado exitosamente!");
        setFormProducto({ nombre: "", precio: "", cantidad: "", categoriaId: "" });
        setProductos((prev) =>
          prev.map((prod) => (prod.id === productoEditado.id ? { ...prod, ...data } : prod))
        );
        setProductoEditado(null);
      }
    } catch (error) {
      setMensaje("Error al actualizar el producto.");
      console.error("Error:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const response = await fetch(`https://3.84.162.25/productos/productos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.error) {
        setMensaje(data.error);
      } else {
        setMensaje("¡Producto eliminado exitosamente!");
        setProductos((prev) => prev.filter((prod) => prod.id !== id));
      }
    } catch (error) {
      setMensaje("Error al eliminar el producto.");
      console.error("Error:", error);
    }
  };

  const iniciarEdicionProducto = (producto) => {
    setProductoEditado(producto);
    setFormProducto({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad,
      categoriaId: producto.categoria.id,
    });
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={filtro}
          onChange={handleFiltroChange}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            display: "block",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      <h2>Lista de Productos</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>{producto.cantidad}</td>
              <td>{producto.categoria.nombre}</td>
              <td>
                <button onClick={() => iniciarEdicionProducto(producto)}>Editar</button>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={productoEditado ? editarProducto : agregarProducto}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={formProducto.nombre}
            onChange={handleProductoChange}
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formProducto.precio}
            onChange={handleProductoChange}
          />
          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={formProducto.cantidad}
            onChange={handleProductoChange}
          />
          <select
            name="categoriaId"
            value={formProducto.categoriaId}
            onChange={handleProductoChange}
          >
            <option value="">Seleccionar Categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          {productoEditado ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
};

export default ProductosView;
