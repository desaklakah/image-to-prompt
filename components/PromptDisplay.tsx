
import React, { useState } from 'react';
import { PromptData } from '../types';

interface PromptDisplayProps {
  promptData: PromptData;
}

const CopyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const PromptSection: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
                <button onClick={handleCopy} className="p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent">
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400"/> : <CopyIcon className="w-5 h-5"/>}
                </button>
            </div>
            <p className="p-4 bg-brand-secondary rounded-lg text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{content}</p>
        </div>
    );
};


const PromptDisplay: React.FC<PromptDisplayProps> = ({ promptData }) => {
  const { positive_prompt, negative_prompt, parameters } = promptData;

  return (
    <div className="w-full text-white animate-fade-in">
        <PromptSection title="Positive Prompt" content={positive_prompt} />
        <PromptSection title="Negative Prompt" content={negative_prompt} />
        
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Generation Parameters</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-brand-secondary rounded-lg">
                {Object.entries(parameters).map(([key, value]) => {
                    if (key === 'color_palette') return null; // Handled separately
                    return (
                        <div key={key}>
                            <p className="text-sm text-gray-400 capitalize">{key.replace(/_/g, ' ')}</p>
                            <p className="font-semibold text-gray-200">{value}</p>
                        </div>
                    )
                })}
            </div>
        </div>

        <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Color Palette</h3>
            <div className="flex flex-wrap gap-3 p-4 bg-brand-secondary rounded-lg">
                {parameters.color_palette.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div style={{ backgroundColor: color }} className="w-12 h-12 rounded-md border-2 border-gray-500 shadow-md"></div>
                        <p className="mt-1 text-xs text-gray-400 font-mono">{color}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default PromptDisplay;
