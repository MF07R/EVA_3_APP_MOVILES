# Cashi  — App de Finanzas Personales

Aplicación móvil desarrollada con React Native y Expo para gestionar transacciones e ingresos personales, integrada con un backend real mediante API REST.

## URL de la API
https://cashi-api.labs.dobleb.cl

## Requisitos previos

- Node.js instalado
- Expo CLI instalado
- Dispositivo físico con Expo Go o emulador Android/iOS

## Instalación

# 1. Clonar el repositorio
git clone https://github.com/MF07R/EVA_3_APP_MOVILES.git

# 2. Entrar a la carpeta
cd EVA_3

# 3. Instalar dependencias
npm install

# 4. Instalar dependencias de hardware y seguridad
npx expo install expo-image-picker
npx expo install expo-location
npx expo install expo-secure-store

# 5. Correr la app
npx yarn start --tunnel

Luego escanea el QR con Expo Go desde tu celular.

## Funcionalidades

- Login y registro de usuario con JWT
- Al reabrir la app, si hay token guardado va directo a transacciones
- Logout desde la pantalla de perfil
- Listar, crear, editar y eliminar transacciones contra el backend
- Ver balance calculado por el servidor
- Listar categorías disponibles desde el servidor
- Adjuntar foto del comprobante a una transacción (se sube al servidor)
- Registrar ubicación GPS de una transacción
- Los errores del servidor se muestran en pantalla

## Arquitectura
services/

api.ts              — centraliza todas las llamadas HTTP, headers y manejo de errores

upload.service.ts   — sube imágenes al servidor y retorna la URL pública
contexts/

AuthContext.tsx     — maneja el token JWT, login, registro y logout
hooks/

useAuth.ts          — consume AuthContext, usado por cualquier hook o componente

useTransactions.ts  — CRUD de transacciones contra la API

useCategories.ts    — lista categorías desde la API

useImagePicker.ts   — maneja cámara, galería y permisos

useLocation.ts      — maneja GPS y permisos

Ningún componente ni pantalla importa `fetch`, `SecureStore` ni `apiService` directamente — toda la lógica vive en hooks y servicios.

## Endpoints consumidos

| Método | Ruta | Descripción |
|---|---|---|
| POST | /auth/register | Registro |
| POST | /auth/login | Login, devuelve token |
| GET | /transactions | Transacciones del usuario |
| POST | /transactions | Crear transacción |
| PATCH | /transactions/:id | Editar transacción |
| DELETE | /transactions/:id | Eliminar transacción |
| GET | /transactions/balance | Balance del usuario |
| POST | /transactions/upload | Subir foto, devuelve imageUrl |
| GET | /categories | Listar categorías |

## Uso de IA

Se utilizó Claude (Anthropic) como herramienta de apoyo para los estilos

## Nota sobre iOS

La API presenta un error en Expo Go con `TypeError: Network request failed`. ESta fue verificada con Thunder Client donde responde con los códigos esperados.
