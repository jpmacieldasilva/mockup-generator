
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface DisplayPanelProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
}

const WelcomeState: React.FC = () => (
  <div className="text-center text-gray-400">
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <h3 className="mt-4 text-xl font-semibold text-gray-200">Seu mockup aparecerá aqui</h3>
    <p className="mt-2">Descreva a interface que você deseja criar no painel à esquerda e clique em "Gerar Mockup".</p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="text-center text-gray-400">
    <SpinnerIcon className="mx-auto h-16 w-16 text-indigo-400" />
    <h3 className="mt-4 text-xl font-semibold text-gray-200">Criando sua obra-prima...</h3>
    <p className="mt-2">A IA está desenhando pixels. Isso pode levar alguns segundos.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center text-red-400 bg-red-900/20 border border-red-500 rounded-lg p-6">
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="mt-4 text-xl font-semibold text-red-300">Ops! Algo deu errado.</h3>
    <p className="mt-2 text-red-400">{message}</p>
  </div>
);

const ImageDisplay: React.FC<{ imageB64: string }> = ({ imageB64 }) => {
  const imageUrl = `data:image/jpeg;base64,${imageB64}`;
  
  return (
    <div className="relative w-full h-full group">
      <img
        src={imageUrl}
        alt="Mockup gerado por IA"
        className="object-contain w-full h-full rounded-lg shadow-2xl transition-shadow duration-300 group-hover:shadow-indigo-500/30"
      />
      <a
        href={imageUrl}
        download="mockup-ia.jpeg"
        className="absolute bottom-4 right-4 bg-gray-900/70 text-white py-2 px-4 rounded-lg flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm hover:bg-gray-800/80"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        Baixar
      </a>
    </div>
  );
};


export const DisplayPanel: React.FC<DisplayPanelProps> = ({ isLoading, error, generatedImage }) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorState message={error} />;
    }
    if (generatedImage) {
      return <ImageDisplay imageB64={generatedImage} />;
    }
    return <WelcomeState />;
  };

  return (
    <div className="bg-gray-800/50 border border-dashed border-gray-600 rounded-xl w-full h-full flex items-center justify-center p-4 md:p-8">
      {renderContent()}
    </div>
  );
};
