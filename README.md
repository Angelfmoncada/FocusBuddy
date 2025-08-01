# 🎯 FocusBuddy - Aplicación de Productividad Pomodoro

**FocusBuddy** es una aplicación completa de productividad que implementa la técnica Pomodoro con gestión de tareas, estadísticas avanzadas y persistencia de datos. Construida con React, TypeScript, TailwindCSS y Zustand.

## ✨ Características Principales

### 🕒 Timer Pomodoro Funcional
- **Ciclos automáticos**: 25 min foco → 5 min descanso → 25 min foco... cada 4 ciclos → 15 min descanso largo
- **Controles completos**: Start, Pause, Reset con persistencia de estado
- **Notificaciones**: Sonido personalizable y notificaciones del navegador
- **Animaciones visuales**: Anillo de progreso animado con efectos de vibración
- **Persistencia**: El timer mantiene su estado al recargar la página

### ✅ Gestión de Tareas
- **CRUD completo**: Agregar, completar, eliminar y editar tareas
- **Filtros avanzados**: All / Active / Completed con búsqueda en tiempo real
- **Prioridades**: Normal y High priority con indicadores visuales
- **Progreso visual**: Barra de progreso y estadísticas de tareas
- **Validaciones**: Prevención de tareas duplicadas y vacías
- **Persistencia**: Todas las tareas se guardan automáticamente

### 📊 Estadísticas Avanzadas
- **Múltiples períodos**: Día actual, 7 días, mes, trimestre, semestre
- **Métricas completas**: 
  - Total de pomodoros completados
  - Minutos de enfoque acumulados
  - Tareas completadas
  - Días activos
- **Gráficas animadas**: Visualización de progreso semanal
- **Filtros temporales**: Selector de rango de tiempo dinámico
- **Exportación de datos**: Función para limpiar estadísticas

### ⚙️ Configuraciones Personalizables
- **Duración de sesiones**: Focus (1-60 min), Short Break (1-30 min), Long Break (5-60 min)
- **Automatización**: Auto-start para descansos y pomodoros
- **Sonidos**: Bell, Chime, Notification con vista previa
- **Intervalos**: Configuración de cuántos pomodoros antes del descanso largo
- **Reset**: Restaurar configuraciones por defecto

### 🌗 Modo Oscuro/Claro
- **Toggle dinámico**: Cambio instantáneo entre temas
- **Persistencia**: El tema se mantiene entre sesiones
- **Diseño adaptativo**: Todos los componentes optimizados para ambos modos
- **Transiciones suaves**: Animaciones fluidas al cambiar tema

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Styling y diseño responsive
- **Framer Motion** - Animaciones y transiciones
- **React Router DOM v6** - Navegación entre páginas

### Estado y Persistencia
- **Zustand** - Gestión de estado global
- **LocalStorage** - Persistencia automática de datos
- **Custom Hooks** - Lógica reutilizable

### UI/UX
- **Lucide React** - Iconografía moderna
- **Glassmorphism** - Efectos de cristal y blur
- **Mobile-first** - Diseño completamente responsive
- **Accesibilidad** - ARIA labels y navegación por teclado

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Vista previa del build
npm run lint     # Linting del código
```

## 🎯 Funcionalidades Implementadas

### ✅ Completamente Funcional
- [x] Timer Pomodoro con ciclos automáticos
- [x] Gestión completa de tareas (CRUD)
- [x] Sistema de estadísticas avanzadas
- [x] Configuraciones personalizables
- [x] Modo oscuro/claro
- [x] Persistencia en LocalStorage
- [x] Navegación entre páginas
- [x] Notificaciones de sonido y navegador
- [x] Diseño responsive
- [x] Animaciones y transiciones
- [x] Sistema de toasts/notificaciones
- [x] Validaciones de formularios
- [x] Accesibilidad básica

## 📱 Páginas y Navegación

### 🏠 Home (Timer)
- Timer Pomodoro principal con anillo de progreso animado
- Estadísticas rápidas del día y semana
- Controles Start/Pause/Reset
- Información sobre la técnica Pomodoro

### ✅ Tasks
- Lista de tareas con filtros (All/Active/Completed)
- Agregar nuevas tareas con prioridades
- Marcar como completadas y eliminar
- Búsqueda en tiempo real
- Estadísticas de progreso visual

### 📊 Stats
- Filtros por período (día, semana, mes, trimestre, semestre)
- Gráficas de progreso animadas
- Métricas detalladas de productividad
- Opción para limpiar todos los datos

### ⚙️ Settings
- Configuración de duraciones de sesiones
- Opciones de automatización
- Selección de sonidos de notificación
- Toggle de tema oscuro/claro
- Reset de configuraciones a valores por defecto

## 🔒 Persistencia y Seguridad

- **LocalStorage**: Todos los datos se guardan localmente
- **Hidratación**: Estado restaurado automáticamente al iniciar
- **Validaciones**: Prevención de datos inválidos
- **Privacidad**: Todos los datos permanecen en el dispositivo del usuario

---

**FocusBuddy** - Tu compañero de productividad para mantener el foco y alcanzar tus objetivos. 🎯✨
