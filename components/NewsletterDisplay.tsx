
import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Loader } from './common/Loader';
import { EditIcon } from './icons/EditIcon';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { toast } from 'react-hot-toast';

interface NewsletterDisplayProps {
    content: string;
    onEdit: (prompt: string) => void;
    isLoading: boolean;
}

export const NewsletterDisplay: React.FC<NewsletterDisplayProps> = ({ content, onEdit, isLoading }) => {
    const [editPrompt, setEditPrompt] = useState('');

    const handleCopyToClipboard = () => {
        if (content) {
            navigator.clipboard.writeText(content);
            toast.success('Copied to clipboard!');
        }
    };

    const handleExport = () => {
        if (content) {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'newsletter.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Exported as newsletter.txt');
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Generated Newsletter</h2>
                <div className="flex gap-2">
                    <Button onClick={handleCopyToClipboard} variant="secondary" size="sm" disabled={!content || isLoading} title="Copy to Clipboard">
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleExport} variant="secondary" size="sm" disabled={!content || isLoading} title="Export as TXT">
                        <DownloadIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-96"><Loader /></div>
            ) : content ? (
                <div className="prose prose-invert max-w-none bg-gray-900 p-4 rounded-md border border-gray-700 h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans">{content}</pre>
                </div>
            ) : (
                <div className="flex justify-center items-center h-96 bg-gray-800/50 rounded-md border-2 border-dashed border-gray-600">
                    <p className="text-gray-400">Your generated newsletter will appear here.</p>
                </div>
            )}

            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Enter editing instructions (e.g., 'Make it more casual')"
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    disabled={isLoading || !content}
                />
                <Button onClick={() => onEdit(editPrompt)} disabled={isLoading || !content}>
                    <EditIcon className="h-5 w-5 mr-2" />
                    {isLoading ? 'Editing...' : 'Edit'}
                </Button>
            </div>
        </Card>
    );
};
