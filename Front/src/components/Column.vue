<template>
  <div :class="['column-box', type]">
    <h2>{{ title }}</h2>
    <div :class="['column-separator', type]"></div>

    <draggable
      :modelValue="notes"
      @update:modelValue="onUpdateModelValue"
      :group="{ name: 'notes' }"
      item-key="id"
      style="min-height: 150px;"
    >
      <template #item="{ element }">
        <NoteCard
          :note="element"
          :editingId="editingId"
          :editText="editText"
          :activeMenuId="activeMenuId"
          @toggleMenu="toggleMenu"
          @closeMenu="closeMenu"
          @startEdit="startEdit"
          @saveEdit="saveEdit"
          @cancelEdit="cancelEdit"
          @confirmDelete="confirmDelete"
          @updateEditText="updateEditText"
        />
      </template>
    </draggable>

    <button @click="toggleInput" class="add-note-button">➕ Agregar nota</button>

    <div v-if="showInput" class="add-note-form">
      <input
        ref="inputRef"
        v-model="newNoteText"
        @keyup.enter="addNote"
        type="text"
        placeholder="Escribe una nueva nota"
      />
      <button @click="addNote">Agregar</button>
    </div>
  </div>
</template>

<!-- Script -->
<script setup>
import { ref, nextTick, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'
import draggable from 'vuedraggable' 
import NoteCard from './NoteCard.vue' 

// --- Props y emits
const props = defineProps({
 title: String,
 notes: Array,
 type: String,
    // 💡 RECIBIMOS EL ESTADO GLOBAL DESDE Board.vue
 editingId: [Number, null], 
 editText: String, 
 activeMenuId: [Number, null]
})

const emit = defineEmits([
 'update:notes',
 'startEdit',  // NUEVO: Para iniciar la edición global
 'saveEdit',  // NUEVO: Para guardar la edición global
 'cancelEdit',  // NUEVO: Para cancelar la edición global
 'update:editText', // NUEVO: Para actualizar el texto global
 'update:activeMenuId' // NUEVO: Para controlar el menú global
])

// --- Refs (Solo estados locales)
const newNoteText = ref('')
const showInput = ref(false) 
const inputRef = ref(null) 

// 🛑 IMPORTANTE: Eliminamos los refs locales editingId, editText, activeMenuId

// 1. Alterna la visibilidad del input y enfoca
function toggleInput() {
   showInput.value = !showInput.value
   if (showInput.value) {
   // Usa nextTick para enfocar DESPUÉS de que el input se renderice
   nextTick(() => {
   inputRef.value?.focus()
   })
   } else {
   // Limpia el texto si se cierra
   newNoteText.value = ''
   }
}

// 2. Agrega la nueva nota a la lista
function addNote() {
    const text = newNoteText.value.trim()
    if (!text) {
    showInput.value = false 
    return
    }
  
    // Genera un ID único (Date.now() es un buen temporal)
    const newId = Date.now() 
  
    const newNote = {
    id: newId,
    text: text
    }

  // Combina las notas antiguas con la nueva y emite el array completo al Board.vue
  emit('update:notes', [...props.notes, newNote])
    
  // Limpia y oculta el formulario
  newNoteText.value = ''
  showInput.value = false
}

// 3. Manejador de vuedraggable para actualizar el array (drag & drop)
function onUpdateModelValue(newNotes) {
 // Emite la nueva lista después de un cambio por drag and drop
 emit('update:notes', newNotes)
}


// ... (toggleInput, onUpdateModelValue, addNote se mantienen)

// 🔑 Lógica del Menú Único
function toggleMenu(id) {
  // 1. Si el ID que se recibe es el mismo que ya está abierto, lo cerramos globalmente.
  if (props.activeMenuId === id) {
    emit('update:activeMenuId', null);
      return;
  }
 
  // 2. Cancelamos cualquier edición activa antes de abrir el menú.
  cancelEdit(); 

  // 3. Abrimos el nuevo menú, actualizando el estado global.
  emit('update:activeMenuId', id);
}

// 🔑 Lógica de Inicio de Edición
function startEdit(note) {
  // 1. Cierra el menú global
  emit('update:activeMenuId', null); 
 
  // 2. Emite el evento al Board.vue para establecer el editingId y el editText
  emit('startEdit', note)
}

// 🔑 Lógica de Guardar Edición
function saveEdit(note) {
// Usamos la prop global (props.editText) en lugar del ref local
 const updatedText = props.editText.trim() 
   if (!updatedText) return

  // Emitimos al padre para que guarde y limpie el estado
  emit('saveEdit', { noteId: note.id, newText: updatedText })
}

// 🔑 Lógica de Cancelar Edición
function cancelEdit() {
 // Emitimos al padre para que limpie el estado
 emit('cancelEdit')
}

// Escucha si surgen cambios en el componente NoteCard y los emite al padre.
function updateEditText(value) {
 emit('update:editText', value)
}

// Muestra confirmación antes de eliminar la nota seleccionada.
function confirmDelete(note) {
  // Cierra el menú global antes de la confirmación
    emit('update:activeMenuId', null); 
    const confirmed = confirm('¿Estás seguro de eliminar esta nota?')
    if (!confirmed) return
    const updatedNotes = props.notes.filter(n => n.id !== note.id)
    emit('update:notes', updatedNotes)
}

// 🔑 Manejador de Clic Global (para cerrar menú)
function handleDocumentClick(event) {
 // Si hay un menú abierto, lo cerramos globalmente.
  if (props.activeMenuId !== null) {
    emit('update:activeMenuId', null); 
  }
}

onMounted(() => {
 document.addEventListener('click', handleDocumentClick);
})

onUnmounted(() => {
 document.removeEventListener('click', handleDocumentClick);
})
</script>

<style scoped>
@import '../assets/styles/Column.css';
</style>