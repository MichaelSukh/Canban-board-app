import { Trash, ArrowRight } from "lucide-react";
import { useState } from "react";

interface CardProps {
    title: string;
    description?: string;
    date?: string;
    tags?: { id: string; label: string; color: string }[];
    onSelect?: () => void;
    onDelete?: () => void;
    onCreateTag?: () => void;
}

export const Card = ({
    title,
    description = "",
    date = "MM:dd",
    tags = [{ id: '1', label: 'High Pr.', color: 'bg-red-500' }],
    onSelect,
    onDelete,
    onCreateTag
}: CardProps) => {
    const [selectedTag, setSelectedTag] = useState("0");

    const tagColor =
        selectedTag === "1" ? "text-red-600" :
            selectedTag === "2" ? "text-orange-500" :
                selectedTag === "3" ? "text-green-600" : "text-black";

    return (
        <div className="flex flex-col w-full max-w-sm 
                bg-white border-[3px] border-black p-4
                font-mono shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] 
                hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transition-shadow duration-300">

            <div className="flex justify-between items-center mb-4">
                <div className="relative flex items-center justify-center">
                    <input
                        type="radio"
                        name={`card-status-${title}`}
                        className="peer appearance-none 
                                w-6 h-6 rounded-full border-[2px] border-black bg-red-500
                                shadow-[0px_3px_0px_0px_rgba(0,0,0,0.6)] 
                                cursor-pointer transition-colors 
                                checked:bg-green-500 checked:shadow-none transition-shadow duration-300"
                    />
                </div>

                <button onClick={onDelete} className="text-red-500 hover:text-red-700 transition-colors ml-2">
                    <Trash size={20} strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold tracking-wide">{title}</h3>
                    <p className="text-black text-sm">{description}</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-2">
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className={`px-3 py-1.5 rounded-full border-[2px] border-black bg-white ${tagColor} font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none focus:ring-0`}
                    >
                        <option value="0" className="text-black">Choise Tag</option>
                        <option value="1" className="text-red-600 font-bold">High</option>
                        <option value="2" className="text-orange-500 font-bold">Medium</option>
                        <option value="3" className="text-green-600 font-bold">Low</option>
                    </select>
                </div>

                <div className="font-bold text-sm">
                    Date: {date}
                </div>
            </div>
        </div>
    );
};