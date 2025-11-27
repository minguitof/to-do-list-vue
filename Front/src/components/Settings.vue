<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconSettings from './icons/IconSettings.vue'
import { utils, writeFile } from 'xlsx'
// 1. IMPORTAMOS EL STORE
import { useNoteStore } from '../stores/noteStore' // Asegúrate que la ruta sea correcta

const store = useNoteStore() // 2. INICIALIZAMOS EL STORE

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

// --- LÓGICA DE EXPORTACIÓN EXCEL CORREGIDA ---
const exportToExcel = () => {
  // YA NO LEEMOS DE LOCALSTORAGE. 
  // LEEMOS DIRECTAMENTE DE PINIA (La verdad absoluta de la app)
  
  // Como Pinia ya tiene el objeto listo, no necesitamos JSON.parse
  const columns = store.columns 
  
  // Validación simple: Si las columnas están vacías (aunque por defecto Pinia tiene datos)
  if (!columns) {
    alert("No hay datos para exportar")
    return
  }

  // 1. Extraemos las listas directamente del Store
  const todoList = columns.todo || []
  const doingList = columns.doing || []
  const doneList = columns.done || []

  // 2. Encontramos cuál es la columna más larga
  const maxRows = Math.max(todoList.length, doingList.length, doneList.length)

  let excelRows = []

  // 3. Creamos las filas
  for (let i = 0; i < maxRows; i++) {
    const row = {
      // Como estamos leyendo de Pinia (que son objetos reactivos), 
      // accedemos a .text normalmente.
      "Por Hacer": todoList[i] ? todoList[i].text : "",
      "En Progreso": doingList[i] ? doingList[i].text : "",
      "Hecho": doneList[i] ? doneList[i].text : ""
    }
    
    excelRows.push(row)
  }

  // 4. Generar el Excel
  const worksheet = utils.json_to_sheet(excelRows)
  const colWidth = { wch: 30 }
  worksheet['!cols'] = [ colWidth, colWidth, colWidth ] 

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Tablero Visual")
  writeFile(workbook, "Mi_Kanban_Pinia.xlsx")
  
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

<style scoped>
@import '../assets/styles/Settings.css';

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
  border-top: 1px solid #ccc;
  margin-top: 5px;
  padding-top: 10px;
}

.export-button:hover {
  color: #42b883;
  font-weight: bold;
}
</style>