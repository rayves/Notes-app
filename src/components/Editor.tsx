import { useState } from 'react';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import { Note } from '../common/types';

interface EditorProps {
  currentNote: Note | undefined;
  updateNote: (id: string) => void;
}

export default function Editor({ currentNote, updateNote }: EditorProps) {
  const [selectedTab, setSelectedTab] = useState('write');

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  return (
    <section className="pane editor">
      <ReactMde
        value={currentNote!.body}
        onChange={updateNote}
        selectedTab={selectedTab as 'write' | 'preview' | undefined}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        minEditorHeight={80}
        heightUnits="vh"
      />
    </section>
  );
}
