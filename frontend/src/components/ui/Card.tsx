import { Trash } from "lucide-react";
import { useState } from "react";

interface CardProps {
    id?: number;
    title: string;
    description?: string;
    date?: string;
    tags?: number;
    onSelect?: () => void;
    onDelete?: () => void;
    onTagChange?: (newTag: number) => void;
}

export const Card = ({
    id,
    title,
    description = "",
    date = "MM:dd",
    tags = 0,
    onSelect,
    onDelete,
    onTagChange
}: CardProps) => {
    const [selectedTag, setSelectedTag] = useState(tags);

    const tagColor =
        selectedTag === 1 ? "text-red-600" :
            selectedTag === 2 ? "text-orange-500" :
                selectedTag === 3 ? "text-green-600" : "text-black";


    const isLongDescrition = description.length > 30;

    const handleDragStart = (e: React.DragEvent) => {
        if (id !== undefined) {
            e.dataTransfer.setData("cardId", id.toString());
        }
    };

    return (
        <div
            draggable={id !== undefined}
            onDragStart={handleDragStart}
            onClick={onSelect}
            className={`flex flex-col w-full max-w-sm 
                bg-white border-[2px] border-black p-3
                font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] 
                transition-shadow duration-300
                ${id !== undefined ? "cursor-pointer active:cursor-grabbing hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]" : ""}`}>

            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            name={`card-status-${title}`}
                            className="peer appearance-none 
                                    w-5 h-5 rounded-full border-[2px] border-black bg-red-500
                                    shadow-[0px_2px_0px_0px_rgba(0,0,0,0.6)] 
                                    cursor-pointer transition-colors 
                                    checked:bg-green-500 checked:shadow-none transition-shadow duration-300"
                        />
                    </div>

                    {date && date !== "MM:dd" && (
                        <div className="font-bold text-[12px] text-gray-500 bg-gray-100 px-2 py-0.5">
                            {date}
                        </div>
                    )}
                </div>

                <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition-colors ml-2">
                    <Trash size={18} strokeWidth={2.5} />
                </button>
            </div>

            <div
                className="flex flex-col gap-1 hover:bg-gray-100 p-1.5 -mx-1.5 rounded transition-colors"
            >
                <div className="flex justify-between items-center gap-2">
                    <h3 className="text-lg font-bold tracking-wide leading-tight break-words">{title}</h3>

                    <div onClick={(e) => e.stopPropagation()}>
                        <select
                            value={selectedTag}
                            onChange={(e) => {
                                const newTag = Number(e.target.value);
                                setSelectedTag(newTag);
                                onTagChange?.(newTag);
                            }}
                            className={`px-4 py-1 rounded-full border-[2px] border-black bg-white ${tagColor} font-bold text-[12px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none focus:ring-0`}
                        >
                            <option value="0" className="text-black">No tag</option>
                            <option value="1" className="text-red-600 font-bold">High</option>
                            <option value="2" className="text-orange-500 font-bold">Medium</option>
                            <option value="3" className="text-green-600 font-bold">Low</option>
                        </select>
                    </div>
                </div>

                {description && <p className="text-gray-700 text-xs mt-1">{isLongDescrition ? description.slice(0, 40) + '...' : description}</p>}
            </div>
        </div>
    );
};