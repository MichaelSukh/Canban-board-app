import { AddButton } from './AddButton';
import { Settings, Trash } from 'lucide-react';
import { useState } from 'react';

interface ColumnProps {
    title: string;
    cardsCount?: number;
    onAddCard?: () => void;
    onSettings?: () => void;
    onDelete?: () => void;
    onDropCard?: (cardId: number) => void;
    children?: React.ReactNode;
}

export const Column = ({
    title,
    cardsCount = 0,
    onAddCard,
    onSettings,
    onDelete,
    onDropCard,
    children
}: ColumnProps) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const cardId = e.dataTransfer.getData("cardId");
        if (cardId && onDropCard) {
            onDropCard(Number(cardId));
        }
    };

    return (
        <div className="flex flex-col w-full h-full max-h-full 
                border-[3px] border-black overflow-hidden 
                font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] 
                hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-shadow duration-300">
            <div className="bg-[#2d2d2d] p-4 text-white border-b-[3px] border-black shrink-0">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold mb-1 tracking-wide">{title}</h3>
                    <div className='flex gap-2'>
                        <button onClick={onSettings} className="hover:text-gray-400 transition-colors">
                            <Settings size={20} strokeWidth={2.5} />
                        </button>
                        <button onClick={onDelete} className="text-red-400 hover:text-red-800 transition-colors">
                            <Trash size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
                <p className="text-gray-400 text-sm">{cardsCount} card{cardsCount !== 1 ? 's' : ''}</p>
            </div>

            <div
                className={`bg-[#e8e4d9] flex flex-col flex-grow overflow-hidden transition-colors ${isDragOver ? "bg-[#d4cdb9] ring-2 ring-inset ring-black/40" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className={cardsCount === 0 ? "" : "p-4 flex flex-col gap-4 overflow-y-auto flex-grow items-center"}>
                    {children}
                </div>
                <div className="p-4 shrink-0">
                    <AddButton onClick={onAddCard}>
                        Add Card
                    </AddButton>
                </div>
            </div>
        </div>
    );
};