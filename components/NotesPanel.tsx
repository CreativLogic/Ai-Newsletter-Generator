
import React, from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { TrashIcon } from './icons/TrashIcon';

interface NotesPanelProps {
    notes: string;
    setNotes: (notes: string) => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ notes, setNotes }) => {
    const [localNotes, setLocalNotes] = useLocalStorage<string>('newsletter-notes', '');

    React.useEffect(() => {
        setNotes(localNotes);
    }, [localNotes, setNotes]);

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalNotes(e.target.value);
    };

    const clearNotes = () => {
        setLocalNotes('');
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-white">My Notes</h2>
                <Button onClick={clearNotes} variant="secondary" size="sm" title="Clear Notes">
                    <TrashIcon className="h-4 w-4"/>
                </Button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Your notes are saved automatically and persist between sessions.</p>
            <textarea
                value={localNotes}
                onChange={handleNoteChange}
                placeholder="Jot down ideas, paste text, or draft sections here..."
                className="w-full h-48 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
            />
        </Card>
    );
};
