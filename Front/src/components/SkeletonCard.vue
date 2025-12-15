<template>
  <div class="skeleton-card">
    <div class="skeleton-line title"></div> 
    <div class="skeleton-line text"></div> 
  </div>
</template>

<style scoped>
/* Estos estilos son exclusivos de la tarjeta esqueleto */
.skeleton-card {
  /* Estilos de la tarjeta contenedora */
  background-color: #f0f0f0; /* Fondo gris claro */
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  
  /* Animación de pulso, ¡clave para el efecto! */
  animation: pulse 1.5s infinite ease-in-out;
}

/* Modo oscuro */
:global(.dark) .skeleton-card {
  background-color: #2d3748;
}

/* Estilos de las líneas internas que simulan texto */
.skeleton-line {
  background-color: #ddd;
  height: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
}

:global(.dark) .skeleton-line {
  background-color: #1e1e1e;
}

.title {
  width: 60%; /* Más corto para parecer un título */
  height: 16px;
  margin-bottom: 12px;
}

.text {
  width: 90%; /* Más largo para parecer el cuerpo */
}

/* Definición de la animación de pulso */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>