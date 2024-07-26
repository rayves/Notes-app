import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { Note } from './common/types';
import {
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
// listens to Firestore database for changes - if there is a change then onSnapshot will update the app accordingly
import { notesCollection, db } from './firebase';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string>('');

  useEffect(() => {
    // snapshot of the data is passed when the callback function is called.
    // Sync up our local notes array with the snapshot data.
    // the onSnapshot listener creates a websocket connection with the database
    // on snapshot returns a function
    const unsubscribe = onSnapshot(
      notesCollection,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const notesArr = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as Note),
        );
        setNotes(notesArr);
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentNoteId) setCurrentNoteId(notes[0]?.id);
  }, [notes]);

  const currentNote: Note | undefined =
    notes.find((note) => {
      return note.id === currentNoteId;
    }) || notes[0];

  async function createNewNote(): Promise<void> {
    const newNote: Omit<Note, 'id' | 'updatedAt'> = {
      body: "# Type your markdown note's title here",
      createdAt: new Date().valueOf(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  async function updateNote(text: string): Promise<void> {
    const docRef = await doc(db, 'notes', currentNoteId);
    await setDoc(
      docRef,
      { body: text, updatedAt: new Date().valueOf() },
      { merge: true },
    );
  }

  async function deleteNote(noteId: string): Promise<void> {
    const docRef = await doc(db, 'notes', noteId);
    await deleteDoc(docRef);
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
          <Editor currentNote={currentNote} updateNote={updateNote} />
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
