import { SelectButton } from './SelectButton';
import { Settings, Trash } from 'lucide-react';

interface BoardCardProps {
    title: string;
    columnsCount?: number;
    description?: string;
    onSelect?: () => void;
    onSettings?: () => void;
    onDelete?: () => void;
}

export const BoardCard = ({
    title,
    columnsCount = 0,
    description,
    onSelect,
    onSettings,
    onDelete
}: BoardCardProps) => {
    return (
        <div className={`flex flex-col w-full max-w-sm 
                border-[3px] border-black overflow-hidden 
                font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] 
                hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-shadow duration-300`}>
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
                <p className="text-gray-400 text-sm">{columnsCount} column{columnsCount !== 1 ? 's' : ''}</p>
            </div>

            <div className="bg-[#e8e4d9] p-4 flex flex-col flex-grow min-h-[140px]">
                {description && (
                    <div className="font-bold text-black mb-4">
                        {description}
                    </div>
                )}

                <div className="mt-auto">
                    <SelectButton onClick={onSelect} className="bg-[#2f2f2f] hover:bg-[#1f1f1f] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] border-2 border-black">
                        Select Board
                    </SelectButton>
                </div>
            </div>
        </div>
    );
};
