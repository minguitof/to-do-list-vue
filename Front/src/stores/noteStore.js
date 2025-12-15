import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue"; 
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api/notes';

export const useNoteStore = defineStore("note", () => {

    const columns = reactive({
        todo: [],
        doing: [],
        done: [],
    });

    const isLoading = ref(false);

    async function fetchNotes () {
        isLoading.value = true;
        try {
            const response = await axios.get(API_URL);
            const notesFromApi = response.data;

            columns.todo = notesFromApi.filter(n => n.columnType === 'todo');
            columns.doing = notesFromApi.filter(n => n.columnType === 'doing');
            columns.done = notesFromApi.filter(n => n.columnType === 'done');
        } catch(error) {
            console.error("Error: No se logro traer notas desde la API");
        } finally {
            isLoading.value = false;
        }
    }

    //Agregar notas desde la API
    async function addNoteToColumn(columnType, text) {
        const newNote = {
            id: uuidv4(),
            text: text,
            columnType: columnType 
        }

        try {
            // A. Enviamos al Backend (Esperamos respuesta)
            await axios.post(API_URL, newNote);
            
            // B. Si el backend dice OK, actualizamos la vista (Frontend)
            columns[columnType].push(newNote); 
        } catch (error) {
            console.error('Error: No se logro guardar en backend: ', error);
        }
    }
    
    //Actualizar columna completa (Drag & Drop) desde la API
    function updateColumn(key, newNotes){
        columns[key] = newNotes;

        //Aun hace falta lógica para generar un PUT o PATCH a la nota.
        newNotes.forEach(async (notes) => {
            if (notes.columnType !== key) {
                const updateData = { columnType: key };

                try {
                    await axios.patch(`${API_URL}/${notes.id}`, updateData);

                    notes.columnType = key;
                } catch (error) {
                    console.error(`Error: no se logro mover la nota ${note.id} a ${key}:`, error);
                }
            }
        });
    }

    // Editar texto de una nota
    async function updateNoteText(noteId, newText) {
        const columnKey = Object.keys(columns).find(key => columns[key].some(n => n.id === noteId));
        if (!columnKey) return;

        const noteToUpdate = columns[columnKey].find(n => n.id === noteId);

        try {
            //Peteición PATCH: Actualiza campo del recurso del servidor
            await axios.patch(`${API_URL}/${noteId}`, { text: newText });

            noteToUpdate.text = newText;
        } catch(error) {
            console.error('Error: No se logro editar la nota: ', error);
        }
    }

    // Implementar la función de eliminar es similar a un update
    async function deleteNote(noteId) {
        try{
            await axios.delete(`${API_URL}/${noteId}`);

            for (const key in columns){
                columns[key] = columns[key].filter(n => n.id !== noteId)
            }
        } catch(error){
            console.error("Error: No se logro eliminar la nota: ", error);
            
        }
    }


    // Llamo a la función de carga al crear el store
    fetchNotes();

    // --- RETORNO (MUY IMPORTANTE) ---
    // Todo lo que quieras usar en tus componentes debe ir aquí
    return {
        columns,
        isLoading,
        fetchNotes,
        updateColumn,
        addNoteToColumn,
        deleteNote,
        updateNoteText
    };
});