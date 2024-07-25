import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
//import data from "./assets/data"
import Split from 'react-split';
import { nanoid } from 'nanoid';
import { Note } from './common/types';

export default function App() {
  // Lazy loading of localStorage.getItem
  const initialNotes: () => Note[] = () =>
    JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [currentNoteId, setCurrentNoteId] = useState<string>(
    (notes[0] && notes[0].id) || '',
  );

  function createNewNote(): void {
    const newNote: Note = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text: string): void {
    setNotes((oldNotes) => {
      const newNotes: Note[] = [];
      for (const oldNote of oldNotes) {
        if (oldNote.id === currentNoteId) {
          newNotes.unshift({ ...oldNote, body: text });
        } else {
          newNotes.push(oldNote);
        }
      }
      return newNotes;
    });
  }

  function findCurrentNote(): Note | undefined {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
