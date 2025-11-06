<template>
  <div class="settings-wrapper" ref="settingsWrapper"> 
    <button @click="toggleMenu" class="gear-button" aria-label="Abrir configuración">
      <!-- SVG del engranaje -->
      <IconSettings />
    </button>

    <!-- Menú desplegable -->
    <div v-if="menuOpen" class="settings-menu">
      <label>
        🌙 Tema oscuro:
        <input type="checkbox" v-model="darkMode" @change="toggleTheme" />
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue' // Agregamos onUnmounted
import IconSettings from './icons/IconSettings.vue'

const menuOpen = ref(false)
const darkMode = ref(false)
const settingsWrapper = ref(null) // Referencia para el contenedor

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const toggleTheme = () => {
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleClickOutside = (event) => {
  // Si el menú está abierto Y el clic no está dentro del contenedor, lo cierra
  if (menuOpen.value && settingsWrapper.value && !settingsWrapper.value.contains(event.target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }
  
  // Añadir el escuchador de evento al documento
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Eliminar el escuchador al desmontar el componente
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import '../assets/styles/Settings.css';
</style>