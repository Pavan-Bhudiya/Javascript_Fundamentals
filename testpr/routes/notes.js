const express = require('express');
const router = express.Router();

// In-memory "database" - array of notes
let notes = [];
let nextId = 1;

// Helper function to find note by ID
const findNoteById = (id) => {
  return notes.find(note => note.id === parseInt(id));
};

// GET /api/notes - Get all notes
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes'
    });
  }
});

// GET /api/notes/:id - Get a single note
router.get('/:id', (req, res) => {
  try {
    const note = findNoteById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: `Note with id ${req.params.id} not found`
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch note'
    });
  }
});

// POST /api/notes - Create a new note
router.post('/', (req, res) => {
  try {
    const { title, content } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Both title and content are required'
      });
    }

    // Create new note
    const newNote = {
      id: nextId++,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notes.push(newNote);

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: newNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create note'
    });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', (req, res) => {
  try {
    const note = findNoteById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: `Note with id ${req.params.id} not found`
      });
    }

    const { title, content } = req.body;

    // Update note fields if provided
    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    
    note.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update note'
    });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', (req, res) => {
  try {
    const noteIndex = notes.findIndex(note => note.id === parseInt(req.params.id));
    
    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Note with id ${req.params.id} not found`
      });
    }

    const deletedNote = notes.splice(noteIndex, 1)[0];

    res.json({
      success: true,
      message: 'Note deleted successfully',
      data: deletedNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete note'
    });
  }
});

module.exports = router;