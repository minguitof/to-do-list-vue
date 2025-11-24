<template>
  <div class="settings-wrapper" ref="settingsWrapper"> 
    <button @click="toggleMenu" class="gear-button" aria-label="Abrir configuración">
      <IconSettings />
    </button>

    <div v-if="menuOpen" class="settings-menu">
      <label class="menu-item">
        🌙 Tema oscuro:
        <input type="checkbox" v-model="darkMode" @change="toggleTheme" />
      </label>

      <button @click="exportToExcel" class="export-button menu-item">
        📊 Exportar a Excel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconSettings from './icons/IconSettings.vue'
// 1. Importamos las utilidades de la librería xlsx
import { utils, writeFile } from 'xlsx'

const menuOpen = ref(false)
const darkMode = ref(false)
const settingsWrapper = ref(null)

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

// --- LÓGICA DE EXPORTACIÓN EXCEL MEJORADA ---
const exportToExcel = () => {
  const rawData = localStorage.getItem('kanban-notes')
  
  if (!rawData) {
    alert("No hay datos para exportar")
    return
  }

  const parsedData = JSON.parse(rawData) 
  
  // 1. Extraemos las listas en arrays separados
  const todoList = parsedData.todo || []
  const doingList = parsedData.doing || []
  const doneList = parsedData.done || []

  // 2. Encontramos cuál es la columna más larga (para saber cuántas filas crear)
  const maxRows = Math.max(todoList.length, doingList.length, doneList.length)

  let excelRows = []

  // 3. Creamos las filas "horizontales" combinando las 3 columnas
  for (let i = 0; i < maxRows; i++) {
    // Para cada fila, preguntamos: ¿Existe una nota en esta posición?
    // Si existe, ponemos su texto. Si no, ponemos un texto vacío ""
    
    const row = {
      // Opción A: Si quisieras un consecutivo (1, 2, 3) descomenta la línea de abajo:
      // "No.": i + 1, 

      "Por Hacer": todoList[i] ? todoList[i].text : "",
      "En Progreso": doingList[i] ? doingList[i].text : "",
      "Hecho": doneList[i] ? doneList[i].text : ""
    }
    
    excelRows.push(row)
  }

  // 4. Generar el Excel
  const worksheet = utils.json_to_sheet(excelRows)
  
  // Ajuste opcional: Forzar el ancho de las columnas (se ve más pro)
  const colWidth = { wch: 30 } // 30 caracteres de ancho
  worksheet['!cols'] = [ colWidth, colWidth, colWidth ] 

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Tablero Visual")
  writeFile(workbook, "Mi_Kanban_Visual.xlsx")
  
  menuOpen.value = false
}

const handleClickOutside = (event) => {
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
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import '../assets/styles/Settings.css';

/* Estilos extra para el botón de exportar */
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  width: 100%;
  cursor: pointer;
}

.export-button {
  background: none;
  border: none;
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
  text-align: left;
  border-top: 1px solid #ccc; /* Separador visual */
  margin-top: 5px;
  padding-top: 10px;
}

.export-button:hover {
  color: #42b883; /* Verde Vue */
  font-weight: bold;
}
</style>