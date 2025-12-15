<script setup>
import { ref } from 'vue';
import { useNoteStore } from '../stores/noteStore'; // Asegúrate que la ruta sea correcta
import Column from './Column.vue';

// 1. INVOCAR AL STORE
const store = useNoteStore();
// Ahora accedemos a las columnas con: store.columns

// 2. Estado de UI (Esto SÍ se queda aquí o se pasa a otro store de UI,
// pero por ahora dejémoslo aquí.
const editingId = ref(null);
const editText = ref('');
const activeMenuId = ref(null);

// --- Manejadores de Interacción Visual ---

function handleStartEdit(note) {
    editingId.value = note.id;
    editText.value = note.text;
    activeMenuId.value = null;
}

function handleSaveEdit({ noteId, newText }) {
    // LLAMAMOS AL STORE para guardar el dato real
    store.updateNoteText(noteId, newText);
    
    // Limpiamos la interfaz
    editingId.value = null;
    editText.value = '';
}

function handleCancelEdit() {
    editingId.value = null;
    editText.value = '';
}

// Función puente para cuando Column.vue pida actualizar una lista (Drag & Drop)
function handleUpdateNotes(columnKey, newNotes) {
    store.updateColumn(columnKey, newNotes);
}

</script>

<template>
  <div class="board">
     <Column
        title="Por hacer"
        type="todo"
        :notes="store.columns.todo"
        :isLoading="store.isLoading" @update:notes="(newNotes) => handleUpdateNotes('todo', newNotes)"
        
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
        :notes="store.columns.doing"
        :isLoading="store.isLoading" @update:notes="(newNotes) => handleUpdateNotes('doing', newNotes)"
        
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
        :notes="store.columns.done"
        :isLoading="store.isLoading" @update:notes="(newNotes) => handleUpdateNotes('done', newNotes)"
        
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
/* Tus estilos se mantienen igual */
.board {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap; 
  text-align: center;
  padding: 1rem;
}
</style>