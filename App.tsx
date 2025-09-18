
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResearchPanel } from './components/ResearchPanel';
import { NotesPanel } from './components/NotesPanel';
import { NewsletterDisplay } from './components/NewsletterDisplay';
import { LogoIcon } from './components/icons/LogoIcon';
import type { NewsletterOptions, ResearchResult } from './types';
import { generateNewsletter, editNewsletter } from './services/geminiService';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
    const [newsletterOptions, setNewsletterOptions] = useState<NewsletterOptions>({
        topic: '',
        style: 'Informative',
        tone: 'Professional',
    });
    const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
    const [notes, setNotes] = useState<string>('');
    const [newsletterContent, setNewsletterContent] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleGenerate = useCallback(async () => {
        if (!newsletterOptions.topic) {
            toast.error('Please enter a topic for the newsletter.');
            return;
        }
        setIsGenerating(true);
        setNewsletterContent('');
        try {
            const content = await generateNewsletter(newsletterOptions, researchResult?.summary || '', notes);
            setNewsletterContent(content);
            toast.success('Newsletter generated successfully!');
        } catch (error) {
            console.error('Error generating newsletter:', error);
            toast.error('Failed to generate newsletter. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    }, [newsletterOptions, researchResult, notes]);

    const handleEdit = useCallback(async (editPrompt: string) => {
        if (!editPrompt) {
            toast.error('Please enter an editing instruction.');
            return;
        }
        if (!newsletterContent) {
            toast.error('Generate a newsletter before editing.');
            return;
        }
        setIsEditing(true);
        try {
            const editedContent = await editNewsletter(newsletterContent, editPrompt);
            setNewsletterContent(editedContent);
            toast.success('Newsletter updated successfully!');
        } catch (error) {
            console.error('Error editing newsletter:', error);
            toast.error('Failed to edit newsletter. Please try again.');
        } finally {
            setIsEditing(false);
        }
    }, [newsletterContent]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
            <Toaster position="top-center" reverseOrder={false} toastOptions={{
                style: {
                    background: '#334155',
                    color: '#fff',
                },
            }}/>
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-10">
                <div className="container mx-auto flex items-center gap-4">
                    <LogoIcon className="h-8 w-8 text-cyan-400" />
                    <h1 className="text-2xl font-bold tracking-tight text-white">AI Newsletter Generator</h1>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    <div className="lg:col-span-3 space-y-6">
                        <Sidebar
                            options={newsletterOptions}
                            setOptions={setNewsletterOptions}
                            onGenerate={handleGenerate}
                            isGenerating={isGenerating}
                        />
                        <NotesPanel notes={notes} setNotes={setNotes} />
                    </div>

                    <div className="lg:col-span-9 space-y-6">
                        <ResearchPanel onResearchComplete={setResearchResult} />
                        <NewsletterDisplay
                            content={newsletterContent}
                            onEdit={handleEdit}
                            isLoading={isGenerating || isEditing}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
