import { useState, useEffect } from 'react';
import ticketService from '../../../services/ticketService';
import ScrollArea from '../../../components/common/ScrollArea';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function NoteItem({ note, currentUser, ticketId, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(note.note_body);
  const [saving, setSaving] = useState(false);

  const canEdit = !currentUser || note.created_by === currentUser;

  const handleSave = async () => {
    if (!body.trim()) return;
    setSaving(true);
    try {
      await ticketService.updateNote(ticketId, note.note_id, body);
      onUpdated();
      setEditing(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-[#f8fafc] border border-[#f0f2f5] rounded-[6px] px-[10px] py-[8px]">
      {editing ? (
        <>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-[#e8ecf1] rounded-[6px] px-[8px] py-[6px] text-[12px] text-[#0f172a] bg-white outline-none focus:border-brand transition-colors resize-vertical min-h-[70px]"
          />
          <div className="flex gap-[6px] mt-[5px]">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 bg-brand hover:bg-brand/90 text-white rounded-[6px] py-[6px] text-[11px] font-semibold transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setBody(note.note_body); setEditing(false); }}
              className="flex-1 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#475569] rounded-[6px] py-[6px] text-[11px] font-semibold transition-colors">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-[12px] text-[#334155] leading-relaxed whitespace-pre-wrap">{note.note_body}</p>
          <div className="flex items-center justify-between mt-[5px]">
            <span className="text-[10px] text-[#94a3b8]">
              {note.created_by && <span className="font-medium text-[#64748b]">{note.created_by}</span>}
              {note.created_at && <> &middot; {formatDate(note.created_at)}</>}
            </span>
            {canEdit && (
              <button onClick={() => setEditing(true)} className="text-[10px] text-brand hover:underline font-medium">
                Edit
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function NotesPanel({ ticket, isAdmin, currentUser, onUpdated }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [adding, setAdding] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await ticketService.getNotes(ticket.ticket_no);
      setNotes(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadNotes(); }, [ticket.ticket_no]);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setAdding(true);
    try {
      await ticketService.addNote(ticket.ticket_no, newNote);
      setNewNote('');
      loadNotes();
      onUpdated();
    } catch (err) { console.error(err); }
    finally { setAdding(false); }
  };

  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[10px] p-[13px_14px] h-full flex flex-col overflow-hidden">
      <div className="text-[11px] font-bold text-[#475569] mb-2 flex items-center gap-[6px] uppercase tracking-[0.5px] shrink-0">
        <i className="ti ti-notes text-[14px] opacity-60" />
        Notes
      </div>

      {/* Notes list — scrollable, fills available space */}
      <ScrollArea className="flex-1 min-h-0">
        {notes.length > 0 ? (
          <div className="flex flex-col gap-[6px] pr-[2px]">
            {notes.map(note => (
              <NoteItem
                key={note.note_id}
                note={note}
                currentUser={currentUser}
                ticketId={ticket.ticket_no}
                onUpdated={loadNotes}
              />
            ))}
          </div>
        ) : (
          <div className="text-[12px] text-[#94a3b8] italic">No notes added.</div>
        )}
      </ScrollArea>

      {/* Add note — pinned at bottom */}
      {isAdmin && (
        <div className="shrink-0 pt-2 mt-1 border-t border-[#f0f2f5]">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="w-full border border-[#e8ecf1] rounded-[6px] px-[10px] py-[7px] text-[12px] text-[#0f172a] bg-[#f8fafc] outline-none focus:border-brand focus:bg-white transition-colors resize-vertical min-h-[70px]"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newNote.trim()}
            className="w-full bg-brand hover:bg-brand/90 text-white rounded-[6px] py-[8px] text-[12px] font-semibold transition-colors disabled:opacity-50 mt-[6px]"
          >
            {adding ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      )}
    </div>
  );
}
