import axios from 'axios';

// 1. Configuración de la instancia base
const api = axios.create({
    baseURL: 'http://localhost/api', // Cambia a localhost si pruebas local
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// --- ENDPOINTS PARA PRODUCTOS ---

export const productosAPI = {
    // Obtener todos los productos
    listar: async () => {
        const response = await api.get('/productos/');
        return response.data;
    },

    // Crear un nuevo producto
    crear: async (datos) => {
        const response = await api.post('/productos/', datos);
        return response.data;
    },

    // Obtener un producto específico
    detalle: async (id) => {
        const response = await api.get(`/productos/${id}/`);
        return response.data;
    },

    // Actualizar producto
    actualizar: async (id, datos) => {
        const response = await api.put(`/productos/${id}/`, datos);
        return response.data;
    },

    // Borrar producto
    eliminar: async (id) => {
        await api.delete(`/productos/${id}/`);
        return true;
    }
};

// --- ENDPOINTS PARA TRANSACCIONES ---

export const transaccionesAPI = {
    // Listar historial de movimientos
    listar: async (type) => {
        const response = await api.get('/transacciones/?tipo=' + type);
        console.log("Transacciones API response:", response);
        return response.data;
    },

    // Registrar una entrada o salida (Ej: {producto: 1, cantidad: 10, tipo: 'entrada'})
    registrar: async (movimiento) => {
        const response = await api.post('/transacciones/', movimiento);
        return response.data;
    }
};

// --- ENDPOINTS PARA EXISTENCIAS (STOCK) ---

export const existenciasAPI = {
    listar: async () => {
        const response = await api.get('/existencias/');
        console.log("Existencias obtenidas:", response);
        return response.data;
    }
};

export default api;