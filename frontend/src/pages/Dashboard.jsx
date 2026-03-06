import { useEffect, useState } from "react";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetch("/api/notes").then(res => res.json()).then(setNotes);
  }, []);

  async function addNote() {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote }),
    });
    setNewNote("");
    const updated = await fetch("/api/notes").then(res => res.json());
    setNotes(updated);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Your Notes</h1>
      <input className="border p-2 w-full" value={newNote} onChange={e => setNewNote(e.target.value)} />
      <button onClick={addNote} className="bg-purple-500 text-white px-4 py-2 mt-2">Add Note</button>
      <ul>
        {notes.map(n => <li key={n.id} className="border p-2 my-2">{n.content}</li>)}
      </ul>
    </div>
  );
}
