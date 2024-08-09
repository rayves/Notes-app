import { useState } from 'react';
import ReactMde from 'react-mde';
import Showdown from 'showdown';

interface EditorProps {
  tempNoteText: string
  setTempNoteText: (id: string) => void;
}

export default function Editor({ tempNoteText, setTempNoteText }: EditorProps) {
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
        value={tempNoteText}
        onChange={setTempNoteText}
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
