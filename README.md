#Cashi — App de Finanzas Personales

Aplicación móvil desarrollada con React Native y Expo para gestionar transacciones e ingresos personales.



##Requisitos previos

- Node.js instalado
- Dispositivo físico con Expo Go o emulador Android/iOS



##Instalación

####1. Clonar el repositorio

https://github.com/MF07R/EVA_3_APP_MOVILES.git

####2. Instalar dependencias

npm install

####3. Instalar dependencias de hardware

npx expo install expo-image-picker
npx expo install expo-location

####4. Correr la app

npx expo start


Luego escanea el QR con Expo Go desde tu celular.

##Funcionalidades

- Crear, editar y eliminar transacciones
- Crear, editar y eliminar categorías
- Ver balance de ingresos y egresos
- Adjuntar foto del comprobante a una transacción
- Registrar ubicación GPS de una transacción
- Persistencia de datos con AsyncStorage

##cambios respecto a la Evaluación 2

Se agregaron dos campos opcionales al modelo `Transaction`:

- `photoUri?` — URI local de la foto del comprobante
- `location?` — coordenadas GPS `{ latitude, longitude }`

Se crearon dos hooks nuevos:

- `useImagePicker` — maneja cámara, galería y permisos
- `useLocation` — maneja GPS y permisos

Los datos persisten en AsyncStorage junto con la transacción, por lo que sobreviven al cerrar y reabrir la app.

##Uso de IA

Se utilizó Claude (Anthropic) como herramienta de apoyo para agregar estilos

##Autora

Maria Fernanda Rojas
