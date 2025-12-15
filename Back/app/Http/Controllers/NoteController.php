<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Note; 
use App\Repositories\NoteRepository;

class NoteController extends Controller
{

    protected $noteRepository;

    // 1. INYECCIÓN DE DEPENDENCIA: Laravel crea la instancia por nosotros
    public function __construct(NoteRepository $noteRepository)
    {
        $this->noteRepository = $noteRepository;
    }

    // GET: Leer todas las notas
    public function index()
    {
        return response()->json($this->noteRepository->getAll());
    }

    // POST: Crear
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'columnType' => 'required|string|in:todo,doing,done',
        ]);

        $note = $this->noteRepository->create($validated);

        return response()->json($note, 201);
    }

    // PATCH: Actualizar (Para editar texto O mover de columna)
    public function update(Request $request, string $id)
    {
        $note = Note::where('id', $id)->firstOrFail();

        $validated = $request->validate([
            'text' => 'sometimes|string|max:255',
            'columnType' => 'sometimes|string|in:todo,doing,done',
        ]);

        $note = $this->noteRepository->update($id, $validated);

        return response()->json($note);
    }

    // DELETE: Eliminar
    public function destroy(string $id)
    {
        $note = Note::where('id', $id)->firstOrFail();
        $this->noteRepository->delete($id);

        return response()->json(['message' => 'Deleted'], 204); // 204 = Sin contenido
    }
}