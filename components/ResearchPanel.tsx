
import React, { useState, useCallback } from 'react';
import { researchTopic } from '../services/geminiService';
import type { ResearchResult } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Loader } from './common/Loader';
import { SearchIcon } from './icons/SearchIcon';
import { LinkIcon } from './icons/LinkIcon';
import { toast } from 'react-hot-toast';

interface ResearchPanelProps {
    onResearchComplete: (result: ResearchResult) => void;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({ onResearchComplete }) => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ResearchResult | null>(null);

    const handleResearch = useCallback(async () => {
        if (!topic.trim()) {
            toast.error('Please enter a research topic.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const researchResult = await researchTopic(topic);
            setResult(researchResult);
            onResearchComplete(researchResult);
            toast.success('Research completed successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to conduct research.');
        } finally {
            setIsLoading(false);
        }
    }, [topic, onResearchComplete]);

    return (
        <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Research Topic</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic to research..."
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                />
                <Button onClick={handleResearch} disabled={isLoading}>
                    <SearchIcon className="h-5 w-5 mr-2"/>
                    {isLoading ? 'Researching...' : 'Research'}
                </Button>
            </div>
            {isLoading && <div className="flex justify-center items-center p-8"><Loader /></div>}
            {result && (
                <div className="mt-4 space-y-4 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-2">Research Summary</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{result.summary}</p>
                    </div>
                    {result.sources.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Sources</h3>
                            <ul className="space-y-2">
                                {result.sources.map((source, index) => (
                                    <li key={index}>
                                        <a
                                            href={source.web.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                                        >
                                            <LinkIcon className="h-4 w-4 flex-shrink-0"/>
                                            <span className="truncate">{source.web.title || source.web.uri}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};
