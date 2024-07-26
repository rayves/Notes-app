import { Note } from '../common/types';

interface SidebarProps {
  notes: Note[];
  currentNote: Note | undefined;
  setCurrentNoteId: (id: string) => void;
  newNote: () => void;
  deleteNote: (id: string) => void;
}

export default function Sidebar(props: SidebarProps) {
  function noteTitle(noteBody: string): string {
    return noteBody.split('\n')[0].replace(/[#*]/g, '');
  }

  const noteElements = props.notes.map((note) => (
    <div key={note.id}>
      <div
        className={`title ${
          note.id === props.currentNote!.id ? 'selected-note' : ''
        }`}
        onClick={() => props.setCurrentNoteId(note.id)}
      >
        <h4 className="text-snippet">{noteTitle(note.body)}</h4>
        <button
          className="delete-btn"
          onClick={() => props.deleteNote(note.id)}
        >
          <i className="gg-trash trash-icon"></i>
        </button>
      </div>
    </div>
  ));

  return (
    <section className="pane sidebar">
      <div className="sidebar--header">
        <h3>Notes</h3>
        <button className="new-note" onClick={props.newNote}>
          +
        </button>
      </div>
      {noteElements}
    </section>
  );
}
