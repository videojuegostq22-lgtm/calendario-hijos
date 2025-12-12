# FamilySync

Systema de Gestión de Actividades Familiares en Tiempo Real.

## 🚀 Requisitos Previos

Necesitas Node.js (v18+) instalado en tu sistema.

## 🛠️ Instalación y Configuración

1. **Instalar Dependencias**
   ```bash
   npm install
   ```

2. **Configuración de Firebase (OBLIGATORIO)**
   Para que la aplicación funcione, necesitas conectar tu propia base de datos Firebase.
   
   - Ve a [Firebase Console](https://console.firebase.google.com/).
   - Crea un nuevo proyecto.
   - Habilita **Cloud Firestore** (Database) en la sección "Compilación".
   - Ve a "Configuración del Proyecto" -> "General".
   - Registra una nueva app web (icono `</>`).
   - Copia el objeto `const firebaseConfig = { ... }`.
   - Abre el archivo del proyecto: `src/firebase/config.ts`.
   - Reemplaza los valores de `firebaseConfig` con los tuyos.

   *Nota: Asegúrate de que las reglas de seguridad de Firestore permitan lectura/escritura (para pruebas, puedes usar el modo de prueba).*

3. **Ejecutar en Desarrollo**
   ```bash
   npm run dev
   ```

## 📦 Despliegue (GitHub Pages)

El proyecto está configurado para desplegarse automáticamente en GitHub Pages.

1. Asegúrate de tener el repositorio en GitHub.
2. Ejecuta el comando de despliegue:
   ```bash
   npm run deploy
   ```
   Este comando ejecutará primero la construcción (`npm run build`) y luego publicará la carpeta `dist` en la rama `gh-pages`.

## 🗄️ Modelo de Datos (Firestore)

La aplicación utiliza una colección principal llamada `events`.

**Colección: `events`**

| Campo | Tipo | Ejemplo de Valor | Descripción |
|-------|------|------------------|-------------|
| `title` | string | "Partido de Fútbol" | Título del evento |
| `description` | string | "Llevar uniforme azul" | Detalles adicionales |
| `category` | string | "Deporte" | Categoría (Deporte, Médico, Escuela, Otro) |
| `assignedTo` | string | "Liam" | Niño asignado (Liam, Maya, Milo) |
| `startDate` | timestamp | `2024-03-20 15:00` | Fecha y hora de inicio |
| `endDate` | timestamp | `2024-03-20 17:00` | Fecha y hora de fin |
| `createdAt` | timestamp | (Auto) | Fecha de creación del registro |

## 🎨 Personalización

- **Colores de Niños**: Definidos en `src/types/index.ts`.
- **Estilos**: Utiliza Tailwind CSS con configuración extendida en `tailwind.config.ts`.
- **Modo Oscuro**: Automático según preferencia del sistema y botón de alternancia en la barra lateral.
