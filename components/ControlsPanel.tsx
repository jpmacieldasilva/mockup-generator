
import React, { useRef } from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { UploadIcon } from './icons/UploadIcon';

interface ControlsPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
  uploadedImage: string | null;
  onImageUpload: (base64: string) => void;
  onImageRemove: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  isLoading,
  onGenerate,
  uploadedImage,
  onImageUpload,
  onImageRemove
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isImageEditing = uploadedImage !== null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for inline data
        alert("O arquivo de imagem é muito grande. Por favor, escolha um arquivo menor que 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = (loadEvent.target?.result as string)?.split(',')[1];
        if (base64) {
          onImageUpload(base64);
        }
      };
      reader.onerror = () => {
        alert("Não foi possível ler o arquivo de imagem.");
      };
      reader.readAsDataURL(file);
    }
    if(event.target) {
      event.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-2xl h-full flex flex-col space-y-6 border border-gray-700">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Descrição da Interface
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={6}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-200 p-3 placeholder-gray-400"
          placeholder="Ex: Uma tela de login para um aplicativo de música moderno, com tema escuro e botões de neon..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Adicionar Imagem (Opcional)
        </label>
        {isImageEditing ? (
          <div className="relative group">
            <img src={`data:image/jpeg;base64,${uploadedImage}`} alt="Preview" className="w-full rounded-lg shadow-md" />
            <button
              onClick={onImageRemove}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label="Remover imagem"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              disabled={isLoading}
            />
            <button
              onClick={triggerFileInput}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-dashed border-gray-600 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadIcon className="w-5 h-5 mr-2" />
              Clique para carregar
            </button>
          </>
        )}
      </div>

      <div>
        <label htmlFor="aspect-ratio" className={`block text-sm font-medium mb-2 transition-colors ${isImageEditing ? 'text-gray-500' : 'text-gray-300'}`}>
          Proporção da Tela
        </label>
        <select
          id="aspect-ratio"
          name="aspect-ratio"
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-200 p-3 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          disabled={isLoading || isImageEditing}
        >
          <option value="16:9">Web (16:9)</option>
          <option value="9:16">Mobile (9:16)</option>
          <option value="4:3">Tablet (4:3)</option>
          <option value="1:1">Quadrado (1:1)</option>
        </select>
        {isImageEditing && (
          <p className="text-xs text-gray-500 mt-2">A proporção da imagem será usada na geração.</p>
        )}
      </div>

      <div className="flex-grow flex items-end">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            'Gerando...'
          ) : (
            <>
              <MagicWandIcon className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Gerar Mockup
            </>
          )}
        </button>
      </div>
    </div>
  );
};
