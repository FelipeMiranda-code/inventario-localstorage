function toggleMenu() {
  const menu = document.getElementById("menuOpciones");
  menu.classList.toggle("activo");
}

const imagenes = [
  "img/imagen1.jpg",
  "img/imagen2.jpg",
  "img/imagen3.jpg",
  "img/imagen4.jpg",
  "img/imagen5.jpg",
  "img/imagen6.jpg",
];
let indice = 0;

function actualizarImagen() {
  document.getElementById("imagenCarrusel").src = imagenes[indice];
}

function siguienteImagen() {
  indice = (indice + 1) % imagenes.length;
  actualizarImagen();
}

function anteriorImagen() {
  indice = (indice - 1 + imagenes.length) % imagenes.length;
  actualizarImagen();
}

function mostrar(id) {
  const secciones = document.querySelectorAll("#contenido > *");
  secciones.forEach((sec) => sec.classList.add("oculto"));
  document.getElementById(id).classList.remove("oculto");
}

let modoEdicion = false;
let indiceEdicion = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProductos");
  const mensaje = document.getElementById("mensajeGuardado");
  const buscador = document.getElementById("buscador");

  function obtenerProductos() {
    const productos = localStorage.getItem("productos");
    return productos ? JSON.parse(productos) : [];
  }

  function guardarProductos(productos) {
    localStorage.setItem("productos", JSON.stringify(productos));
  }

  function mostrarProductos() {
    const tabla = document
      .getElementById("tablaInventario")
      .querySelector("tbody");
    tabla.innerHTML = "";

    const productos = obtenerProductos();
    if (productos.length === 0) {
      const fila = document.createElement("tr");
      fila.innerHTML = `<td colspan="5">No hay productos.</td>`;
      tabla.appendChild(fila);
      return;
    }

    productos.forEach((p, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.nombre}</td>
      <td>$${p.precio.toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarProducto(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">X</button>
      </td>
      `;
      tabla.appendChild(fila);
    });
  }

  function cargarTablaBusqueda() {
    const tabla = document
      .getElementById("tablaBusqueda")
      .querySelector("tbody");
    tabla.innerHTML = "";

    const productos = obtenerProductos();
    const texto = buscador.value.toLowerCase();

    productos.forEach((p, index) => {
      if (p.nombre.toLowerCase().includes(texto)) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${p.nombre}</td>
        <td>$${p.precio.toFixed(2)}</td>
        <td>${p.stock}</td>
        `;
        tabla.appendChild(fila);
      }
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);

    if (!nombre || isNaN(precio) || isNaN(stock)) {
      mensaje.textContent = "Completa todos los campos correctamente.";
      return;
    }

    const productos = obtenerProductos();
    const indiceExistente = productos.findIndex(
      (p) => p.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (modoEdicion && indiceEdicion !== null) {
      // Editando un producto
      productos[indiceEdicion] = { nombre, precio, stock };
      mensaje.textContent = "Producto editado correctamente.";
      modoEdicion = false;
      indiceEdicion = null;
    } else if (indiceExistente !== -1) {
      // El producto ya existe: sumar stock
      productos[indiceExistente].stock += stock;
      mensaje.textContent = "Stock actualizado correctamente.";
    } else {
      // Producto nuevo
      productos.push({ nombre, precio, stock });
      mensaje.textContent = "¡Producto agregado con éxito!";
    }

    guardarProductos(productos);
    form.reset();
    mostrarProductos();
    cargarTablaBusqueda();

    setTimeout(() => (mensaje.textContent = ""), 3000);
  });

  window.eliminarProducto = function (index) {
    const productos = obtenerProductos();
    productos.splice(index, 1);
    guardarProductos(productos);
    mostrarProductos();
    cargarTablaBusqueda();
  };

  window.editarProducto = function (index) {
    const productos = obtenerProductos();
    const p = productos[index];
    document.getElementById("nombreProducto").value = p.nombre;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;

    modoEdicion = true;
    indiceEdicion = index;

    mostrar("formulario");
  };

  buscador.addEventListener("input", () => {
    cargarTablaBusqueda();
  });

  // Inicialización
  actualizarImagen();
  mostrarProductos();
  cargarTablaBusqueda();
  mostrar("formulario");
});
