import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#5B21B6', // Violeta profundo (personalizado)
      600: '#4c1d95',
      700: '#3c157a',
      800: '#2e1065',
      900: '#240b52',
      950: '#1a073d',
    },
    secondary: {
      500: '#A78BFA', // Lavanda suave
    },
    accent: {
      500: '#9333EA', // Violeta vibrante
    },
    neutral: {
      500: '#F3F4F6', // Fondo gris claro
    },
    surface: {
      0: '#FFFFFF', // base-100
    },
    info: {
      500: '#3B82F6', // Azul
    },
    success: {
      500: '#10B981', // Verde
    },
    warning: {
      500: '#FBBF24', // Amarillo
    },
    error: {
      500: '#EF4444', // Rojo
    },
  },
});

export default MyPreset;
