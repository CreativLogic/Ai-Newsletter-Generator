
import React from 'react';
import type { NewsletterOptions } from '../types';
import { WRITING_STYLES, TONES } from '../constants';
import { Button } from './common/Button';
import { Select } from './common/Select';
import { WandIcon } from './icons/WandIcon';

interface SidebarProps {
    options: NewsletterOptions;
    setOptions: React.Dispatch<React.SetStateAction<NewsletterOptions>>;
    onGenerate: () => void;
    isGenerating: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ options, setOptions, onGenerate, isGenerating }) => {
    const handleOptionChange = (field: keyof NewsletterOptions, value: string) => {
        setOptions(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 space-y-6">
            <h2 className="text-xl font-semibold text-white">Newsletter Controls</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
                    <input
                        type="text"
                        id="topic"
                        value={options.topic}
                        onChange={(e) => handleOptionChange('topic', e.target.value)}
                        placeholder="e.g., The Future of AI"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
                <Select
                    label="Writing Style"
                    value={options.style}
                    onChange={(e) => handleOptionChange('style', e.target.value)}
                    options={WRITING_STYLES}
                />
                <Select
                    label="Tone"
                    value={options.tone}
                    onChange={(e) => handleOptionChange('tone', e.target.value)}
                    options={TONES}
                />
            </div>
            <Button onClick={onGenerate} disabled={isGenerating} className="w-full">
                <WandIcon className="h-5 w-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Newsletter'}
            </Button>
        </div>
    );
};
