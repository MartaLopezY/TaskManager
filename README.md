# Gestión de Tareas - Spring Boot

Este proyecto es una aplicación web para la gestión de tareas, construida con Spring Boot en el backend y JavaScript (con Fetch API) para la interacción del frontend. La aplicación permite crear, leer, actualizar y eliminar tareas (CRUD), con la posibilidad de marcar tareas como completadas. Además, cuenta con un sistema de gestión de prioridades (Alta, Media, Baja) y fechas límite.

## Funcionalidades

- **CRUD de tareas**: Crear, listar, actualizar y eliminar tareas.
- **Marcar tareas como completadas**: Se puede marcar una tarea como completada, lo que cambia su estado visual y deshabilita el botón correspondiente.
- **Prioridades**: Cada tarea puede tener una prioridad (Alta, Media, Baja).
- **Modo oscuro**: La aplicación soporta el cambio entre modo claro y modo oscuro.
- **Notificaciones**: Utiliza "toasts" para mostrar mensajes de éxito o error en la interfaz de usuario.

## Tecnologías utilizadas

- **Backend**:
  - Spring Boot (Java)
  - Spring Web
  - Spring Data JPA
  - H2 Database (para pruebas)

- **Frontend**:
  - HTML, CSS, JavaScript
  - Bootstrap 5 para la interfaz de usuario
  - Fetch API para las solicitudes al backend


