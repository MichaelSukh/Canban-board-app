import { AddButton } from './AddButton';
import { Settings, Trash } from 'lucide-react';

interface ColumnProps {
    title: string;
    cardsCount?: number;
    onAddCard?: () => void;
    onSettings?: () => void;
    onDelete?: () => void;
}

export const Column = ({
    title,
    cardsCount = 0,
    onAddCard,
    onSettings,
    onDelete
}: ColumnProps) => {
    return (
        <div className="flex flex-col w-full max-w-sm 
                border-[3px] border-black overflow-hidden 
                font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] 
                hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-shadow duration-300">
            <div className="bg-[#2d2d2d] p-4 text-white border-b-[3px] border-black">
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

            <div className="bg-[#e8e4d9] p-4 flex flex-col flex-grow min-h-[140px]">
                <div className="mt-auto">
                    <AddButton onClick={onAddCard}>
                        Add Card
                    </AddButton>
                </div>
            </div>
        </div>
    );
};