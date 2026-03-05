# Inventario Electron (Frontend)

Aplicación de escritorio para gestión de inventario construida con React + Electron, conectada a una API Django REST.

## Descarga de compilación para Windows

Puedes descargar la versión compilada para Windows desde este enlace:

- https://drive.google.com/file/d/1XjwffI_stVbR4Q36pZNVDcrIGrOlYgQ1/view?usp=sharing

## Descripción técnica

### Stack

- **UI:** React (Create React App)
- **Desktop Runtime:** Electron
- **Cliente HTTP:** Axios
- **Backend esperado:** Django REST API

### Capacidades funcionales

- **Pestaña Productos:** CRUD de productos (campos principales: `nombre`, `sku`) y visualización de timestamp de actualización cuando el backend lo provee.
- **Pestaña Existencias:** vista de solo lectura para consultar stock consolidado.
- **Pestañas Entradas/Salidas:** registro y consulta de transacciones de inventario.
- **Feedback UI:** mensajes de éxito/error para operaciones de lectura/escritura.

### Endpoints consumidos

- `GET/POST/PUT/DELETE /api/productos/`
- `GET /api/existencias/`
- `GET/POST /api/transacciones/`

### Estructura principal del frontend

- `src/Main.jsx`: orquestación de pestañas, carga de datos y operaciones CRUD.
- `src/api/api.js`: definición central de llamadas HTTP.
- `src/components/Table.jsx`: definición de columnas por contexto (productos/existencias/transacciones).
- `src/components/DataRow.jsx`: normalización/render de celdas y timestamps.
- `main.js`: bootstrap de la ventana Electron.

## Instructivo de uso

### 1) Requisitos

- Node.js 18+ recomendado
- npm 9+ recomendado
- Backend Django ejecutándose y accesible por la URL configurada en `src/api/api.js`

### 2) Instalar dependencias

```bash
npm install
```

### 3) Ejecutar frontend en modo desarrollo (web)

```bash
npm start
```

### 4) Ejecutar app en Electron (requiere frontend corriendo si estás en modo dev)

```bash
npm run electron
```

### 5) Generar build de producción (React)

```bash
npm run build
```

### 6) Compilar instalable/portable para Windows

```bash
npm run dist:win
```

Artefactos generados:

- `dist/Inventario 0.1.0.exe`
- `dist/win-unpacked/`

## Flujo operativo recomendado

1. Crear/editar productos en **Productos**.
2. Consultar stock consolidado en **Existencias**.
3. Registrar movimientos en **Entradas** y **Salidas**.
4. Volver a **Existencias** para validar impacto del movimiento.

## Troubleshooting rápido

- **No aparecen datos:** validar que la API Django esté activa y responda en la URL base configurada.
- **Campos vacíos en tabla:** confirmar que el backend retorna los campos esperados (`nombre`, `sku`, `cantidad`, `fecha`, `updated_at`, etc.).
- **Advertencia al abrir .exe en Windows:** esperado si el binario no está firmado digitalmente.
