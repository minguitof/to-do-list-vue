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
import NoteCard from './NoteCard.vue'  // importamos componente de Notas.

// --- Props y emits
const props = defineProps({
  title: String,
  notes: Array,
  type: String,
})

const emit = defineEmits(['update:notes'])

// --- Refs
const newNoteText = ref('') // contenido que el usuario escribe.
const showInput = ref(false) 
const inputRef = ref(null) // referencia al input para poder hacerle focus.

const editingId = ref(null) // guarda el ID de la nota que se está editando.
const editText = ref('') // texto temporal que se está editando.

const activeMenuId = ref(null) // Menú contextual (tres puntos)

// controla si el input está visible.
function toggleInput() {
  showInput.value = !showInput.value
  if (showInput.value) {
   nextTick(() => inputRef.value?.focus())
  }
}

// Función que emite una nueva lista de notas.
function onUpdateModelValue(newValue) {
  emit('update:notes', newValue)
}

// Crea una nueva nota con un id único (timestamp) y la agrega a la lista.
function addNote() {
  const text = newNoteText.value.trim()
  if (!text) return

  const newNote = { id: Date.now(), text }
  emit('update:notes', [...props.notes, newNote])
  newNoteText.value = ''
  showInput.value = false
}

// Aquí van funciones relacionadas a la edición y menú
function toggleMenu(id) {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

// Maneja qué menú (de los 3 puntos) está abierto actualmente.
function closeMenu(id) {
  if (activeMenuId.value === id) activeMenuId.value = null
}

// Comienza la edición: muestra el input con el texto original.
function startEdit(note) {
  editingId.value = note.id
  editText.value = note.text
  activeMenuId.value = null
}

// Guarda los cambios editados y actualiza la lista.
function saveEdit(note) {
  const updatedText = editText.value.trim()
  if (!updatedText) return
  const updatedNotes = props.notes.map(n =>
    n.id === note.id ? { ...n, text: updatedText } : n
  )
  emit('update:notes', updatedNotes)
  editingId.value = null
}

// Cancela la edición sin guardar.
function cancelEdit() {
  editingId.value = null
}

// Muestra confirmación antes de eliminar la nota seleccionada.
function confirmDelete(note) {
  activeMenuId.value = null
  const confirmed = confirm('¿Estás seguro de eliminar esta nota?')
  if (!confirmed) return
  const updatedNotes = props.notes.filter(n => n.id !== note.id)
  emit('update:notes', updatedNotes)
}

// Escucha si surgen cambios en el componente NoteCard.
function updateEditText(value) {
  editText.value = value
}

// ----------------------------------------------------
// AÑADIR LÓGICA DE CERRAR MENÚ AL CLIC FUERA
// ----------------------------------------------------

// 1. Nueva función para manejar el clic global
function handleDocumentClick(event) {
    // Si hay un menú abierto, lo cerramos.
    // Gracias al .stop en el botón del NoteCard, este handler no se ejecuta
    // cuando haces clic para ABRIR/CERRAR el menú.
    if (activeMenuId.value !== null) {
        // Establecer a null cierra el menú, ya que NoteCard deja de renderizarlo.
        activeMenuId.value = null; 
    }
}

// 2. Montar y Desmontar el oyente global
onMounted(() => {
    // Escucha todos los clics en la página
    document.addEventListener('click', handleDocumentClick);
})

onUnmounted(() => {
    // ¡IMPORTANTE! Remueve el oyente cuando el componente se destruye para evitar fugas de memoria.
    document.removeEventListener('click', handleDocumentClick);
})

// ----------------------------------------------------
// Modificar la función toggleMenu para usar el .stop
//function toggleMenu(id) {
    // Esto se llama solo si el clic NO fue detenido por el .stop
    //activeMenuId.value = activeMenuId.value === id ? null : id
//}

// La función closeMenu ya no es necesaria si usas el handler global, puedes eliminarla
/*
function closeMenu(id) {
  if (activeMenuId.value === id) activeMenuId.value = null
}
*/

</script>

<!-- Styles -->
<style scoped>
@import '../assets/styles/Column.css';
</style>

