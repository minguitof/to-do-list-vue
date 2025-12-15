<?php

namespace App\Repositories;

use App\Models\Note;
use Mews\Purifier\Facades\Purifier;

class NoteRepository
{
    protected $model;

    // Constructor: Inyectamos el modelo para usarlo internamente
    public function __construct(Note $note)
    {
        $this->model = $note;
    }

    /**
     * Recupera todas las notas.
     */
    public function getAll()
    {
        return $this->model->all();
    }

    /**
     * Crea una nueva nota.
     */
    public function create(array $data)
    {

        if (isset($data['text'])) {
            $data['text'] = Purifier::clean($data['text']);
        }

        $note = $this->model->create($data);

        return $note;
    }

    /**
     * Encuentra una nota por su ID o falla.
     */
    public function findOrFail(string $id)
    {
        return $this->model->where('id', $id)->firstOrFail();
    }

    /**
     * Actualiza una nota existente.
     */
    public function update(string $id, array $data)
    {
        $note = $this->findOrFail($id);
        $note->update($data);
        return $note;
    }

    /**
     * Elimina una nota.
     */
    public function delete(string $id)
    {
        return $this->findOrFail($id)->delete();
    }
}