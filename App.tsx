
import React, { useState, useCallback } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { DisplayPanel } from './components/DisplayPanel';
import { generateMockupImage } from './services/geminiService';

export default function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (base64: string) => {
    setUploadedImage(base64);
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Por favor, insira uma descrição para o mockup.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageB64 = await generateMockupImage(prompt, aspectRatio, uploadedImage);
      if (imageB64) {
        setGeneratedImage(imageB64);
      } else {
        setError('Não foi possível gerar a imagem. A resposta da API estava vazia.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, uploadedImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <header className="w-full text-center p-4 border-b border-gray-700 shadow-lg bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          Gerador de Mockups de UI com IA
        </h1>
        <p className="text-gray-400 mt-1">Transforme suas ideias em designs realistas instantaneamente.</p>
      </header>
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 md:p-8 md:gap-8">
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <ControlsPanel
            prompt={prompt}
            setPrompt={setPrompt}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            isLoading={isLoading}
            onGenerate={handleGenerate}
            uploadedImage={uploadedImage}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />
        </aside>
        <section className="flex-grow md:w-2/3 lg:w-3/4">
          <DisplayPanel
            isLoading={isLoading}
            error={error}
            generatedImage={generatedImage}
          />
        </section>
      </main>
    </div>
  );
}
