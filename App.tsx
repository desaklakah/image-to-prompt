
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import PromptDisplay from './components/PromptDisplay';
import Loader from './components/Loader';
import { generatePromptFromImage } from './services/geminiService';
import { PromptData } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<PromptData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
      setImageFile(null);
      setImageUrl(null);
      setGeneratedPrompt(null);
      setError(null);
      setIsLoading(false);
  }

  const handleImageUpload = useCallback(async (file: File) => {
    resetState();
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsLoading(true);
    try {
      const promptData = await generatePromptFromImage(file);
      setGeneratedPrompt(promptData);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-primary text-white p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Prompt Engineer
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload an image to generate a detailed prompt for AI image generators.
          </p>
        </header>

        <main>
          {!imageUrl && (
            <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
          )}

          {imageUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-lg aspect-square bg-brand-secondary rounded-lg p-2 shadow-lg">
                    <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-contain rounded-md" />
                </div>
                <button 
                  onClick={resetState}
                  className="px-6 py-2 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-accent transition-all duration-200"
                >
                  Upload New Image
                </button>
              </div>

              <div className="w-full max-w-lg mx-auto lg:mx-0">
                {isLoading && <Loader />}
                {error && (
                    <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                {generatedPrompt && <PromptDisplay promptData={generatedPrompt} />}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
