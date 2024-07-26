import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import { Note, ButtonMouseEvent } from './common/types';
import { onSnapshot } from 'firebase/firestore'; //listens to Firestore database for changes - if there is a change then onSnapshot will update the app accordingly

export default function App() {
  // Lazy loading of localStorage.getItem
  const initialNotes: () => Note[] = () =>
    JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [currentNoteId, setCurrentNoteId] = useState<string>(
    notes[0]?.id || '',
  );

  const currentNote: Note | undefined =
    notes.find((note) => {
      return note.id === currentNoteId;
    }) || notes[0];

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

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

  function deleteNote(event: ButtonMouseEvent, noteId: string) {
    event.stopPropagation();
    setNotes((prevNotes) => prevNotes.filter((note) => noteId !== note.id));
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={currentNote} updateNote={updateNote} />
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
