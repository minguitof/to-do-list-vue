import { defineStore } from "pinia";
import { reactive, watch } from "vue"; // <--- IMPORTANTE: Importar esto
import { v4 as uuidv4 } from 'uuid';

export const useNoteStore = defineStore("note", () => {
    
    // --- ESTADO (STATE) ---
    const STORAGE_KEY = 'kanban-notes';

    const storedData = localStorage.getItem(STORAGE_KEY);
    
    // Aquí vive la verdad de tus datos
    const columns = reactive(
        storedData
            ? JSON.parse(storedData)
            : {
                todo: [
                    { id: uuidv4(), text: 'Comprar Portatil' },
                    { id: uuidv4(), text: 'Hacer ejercicio' },
                ],
                doing: [
                    { id: uuidv4(), text: 'Aprender Vue 3' },
                ],
                done: [
                    { id: uuidv4(), text: 'Leer un libro' },
                ],
            }
      );

    // --- OBSERVADOR (WATCHER) ---
    // Cada vez que 'columns' cambie, guardamos en localStorage automáticamente
    watch(
        columns,
        (newVal) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
        },
        { deep: true }
    );

    // --- ACCIONES (ACTIONS) ---
    // Funciones para modificar los datos

    // 1. Actualizar una columna completa (necesario para el Drag & Drop)
    function updateColumn(key, newNotes) {
        columns[key] = newNotes;
    }

    // 2. Agregar nota
    function addNoteToColumn(columnType, text) {
        // Usamos Date.now() por ahora, luego cambiaremos a UUID como hablamos

        const newNote = {
          id: uuidv4(),
          text: text
        }

        columns[columnType].push(newNote);
    }

    // 3. Eliminar nota (Busca en todas las columnas)
    function deleteNote(noteId) {
        for (const key in columns) {
            columns[key] = columns[key].filter(n => n.id !== noteId);
        }
    }

    // 4. Editar texto de nota
    function updateNoteText(noteId, newText) {
        for (const key in columns) {
            const list = columns[key];
            const note = list.find(n => n.id === noteId);
            if (note) {
                note.text = newText;
                return; // Terminamos
            }
        }
    }

    // --- RETORNO (MUY IMPORTANTE) ---
    // Todo lo que quieras usar en tus componentes debe ir aquí
    return {
        columns,
        updateColumn,
        addNoteToColumn,
        deleteNote,
        updateNoteText
    };
});