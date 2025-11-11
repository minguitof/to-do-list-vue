<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import Column from './Column.vue'

const STORAGE_KEY = 'kanban-notes' //Se define una clave constante para identificar tus datos dentro del localStorage

// Cargar desde localStorage (o usar datos por defecto)
const storedData = localStorage.getItem(STORAGE_KEY)
const columns = reactive(
  storedData
    ? JSON.parse(storedData)
    : {
        todo: [
          { id: 1, text: 'Comprar Portatil' },
          { id: 2, text: 'Hacer ejercicio' },
        ],
        doing: [
          { id: 3, text: 'Aprender Vue 3' },
        ],
        done: [
          { id: 4, text: 'Leer un libro' },
        ],
      }
)

// 1. Estado centralizado de edición y menú (NUEVO)
const editingId = ref(null) 
const editText = ref('') 
const activeMenuId = ref(null)

// Observar los cambios en columns y guardarlos automáticamente
watch(
  () => columns,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true }
)

// Actualiza la columna con nuevas notas
function updateNotes(columnKey, newNotes) {
  columns[columnKey] = newNotes
}

// 2. FUNCIÓN DE AYUDA: Encontrar y actualizar una nota en CUALQUIER columna
function findAndEditNote(noteId, newText) {
    // Recorre todas las listas definidas en 'columns'
    for (const key in columns) {
        if (columns.hasOwnProperty(key)) {
            const list = columns[key];
            const noteIndex = list.findIndex(n => n.id === noteId);
            if (noteIndex !== -1) {
                // Actualiza la nota reactiva
                list[noteIndex].text = newText;
                return; // Nota encontrada y actualizada
            }
        }
    }
}

// 3. Menejadores globales de edición (NUEVO)
function handleStartEdit(note) {
    // Inicia la edición y garantiza que solo esta nota esté activa
    editingId.value = note.id
    editText.value = note.text
    activeMenuId.value = null // Cierra cualquier menú abierto
}

function handleSaveEdit({ noteId, newText }) {
    // Guarda el texto y actualiza la lista
    findAndEditNote(noteId, newText);
    
    // Limpia el estado global de edición
    editingId.value = null
    editText.value = ''
}

function handleCancelEdit() {
    // Cancela la edición y limpia el estado global
    editingId.value = null
    editText.value = ''
}

</script>

<template>
 <div class="board">
    <Column
        title="Por hacer"
        type="todo"
        :notes="columns.todo"
        @update:notes="updateNotes('todo', $event)"

        :editingId="editingId"
        :editText="editText"
        :activeMenuId="activeMenuId"

        @startEdit="handleStartEdit"
        @saveEdit="handleSaveEdit"
        @cancelEdit="handleCancelEdit"
        @update:editText="(value) => editText = value"
        @update:activeMenuId="(id) => activeMenuId = id"
      />
    <Column
        title="En progreso"
        type="doing"
        :notes="columns.doing"
        @update:notes="updateNotes('doing', $event)"

        :editingId="editingId"
        :editText="editText"
        :activeMenuId="activeMenuId"

        @startEdit="handleStartEdit"
        @saveEdit="handleSaveEdit"
        @cancelEdit="handleCancelEdit"
        @update:editText="(value) => editText = value"
        @update:activeMenuId="(id) => activeMenuId = id"
      />
    <Column
        title="Hecho"
        type="done"
        :notes="columns.done"
        @update:notes="updateNotes('done', $event)"

        :editingId="editingId"
        :editText="editText"
        :activeMenuId="activeMenuId"

        @startEdit="handleStartEdit"
        @saveEdit="handleSaveEdit"
        @cancelEdit="handleCancelEdit"
        @update:editText="(value) => editText = value"
        @update:activeMenuId="(id) => activeMenuId = id"
     />
  </div>
</template>

<style scoped>
.board {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap; /* si no caben en una fila (por ejemplo, en móvil), se bajan. */
  text-align: center;
  padding: 1rem;
}
</style>
