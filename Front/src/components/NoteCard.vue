<template>
  <div class="note-card"> 
    <div v-if="editingId === note.id">
      <input
        :value="editText"
        @input="onInputChange"
        @keyup.enter="() => emit('saveEdit', note)"
        @blur="() => emit('cancelEdit')"
        class="note-input"
        autofocus
      />
    </div>
    <div v-else class="note-content">
      <span>{{ note.text }}</span>
      <button class="menu-button" @click.stop="() => emit('toggleMenu', note.id)">
        <IconThreePoints />
      </button>

      <div v-if="activeMenuId === note.id" class="menu-dropdown" @click.stop>
        <button @click="() => emit('startEdit', note)">✏️ Editar</button>
        <button @click="() => emit('confirmDelete', note)">🗑️ Eliminar</button>
      </div>
      </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import IconThreePoints from './icons/IconThreePoints.vue'

const props = defineProps({
  note: Object,
  editingId: [String, null],
  editText: String,
  activeMenuId: [String, null],
})

const emit = defineEmits(['startEdit', 'saveEdit', 'cancelEdit', 'toggleMenu', 'closeMenu', 'confirmDelete', 'updateEditText'])

function onInputChange(event) {
  emit('updateEditText', event.target.value)
}

</script>

<style scoped>
@import '../assets/styles/NoteCard.css';
</style>


