module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily:{
      'monserrat':['Montserrat','sans-serif'],
      'pacifico':['Pacifico','cursiva'],
    },
    extend: {
      animation:{
        fadeIn:'fadeIn 0.3s ease-in-out'
      },
      keyframes:{
        fadeIn:{
          '0%':{opacity: 0},
          '100%':{opacity: 1},
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss-primeui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#5B21B6",        // Violeta profundo (botones, enlaces)
          "secondary": "#A78BFA",      // Lavanda suave (badges, tags)
          "accent": "#9333EA",         // Violeta vibrante (hover o acciones)
          "neutral": "#F3F4F6",        // Fondo gris claro para cards
          "base-100": "#FFFFFF",       // Fondo principal blanco
          "info": "#3B82F6",           // Azul (barra de progreso)
          "success": "#10B981",        // Verde suave (estado completado)
          "warning": "#FBBF24",        // Amarillo suave (en progreso)
          "error": "#EF4444",          // Rojo suave (errores)
        },
      },
    ],
  },
};
