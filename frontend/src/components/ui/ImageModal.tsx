import { X } from "lucide-react";

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

export const ImageModal = ({ imageUrl, onClose }: ImageModalProps) => {
    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 cursor-zoom-out"
            onClick={onClose}
        >
            <div className="relative max-w-full max-h-full">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition-colors font-bold z-[101]"
                >
                    <X size={32} strokeWidth={2.5} />
                </button>
                <img
                    src={imageUrl}
                    alt="Expanded"
                    className="max-w-[90vw] max-h-[90vh] object-contain border-[4px] border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white cursor-default"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};
