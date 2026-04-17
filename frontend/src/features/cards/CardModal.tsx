import React, { useState, useEffect, useRef } from "react";
import {
    useCreateCardMutation,
    useUpdateCardMutation,
    useGetCardImagesQuery,
    useUploadCardImageMutation,
    useDeleteCardImageMutation
} from "./cardsApi";
import { Input } from "../../components/ui/Input";
import { SelectButton } from "../../components/ui/SelectButton";
import { ImageModal } from "../../components/ui/ImageModal";
import { Trash } from "lucide-react";
import { BASE_URL } from "../../services/api";

interface CardModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "update";
    columnId: number;
    cardId?: number;
    initialData?: {
        title: string;
        description: string;
        priority: number;
        time_limit: string;
    };
}

export const CardModal = ({
    isOpen,
    onClose,
    mode,
    columnId,
    cardId,
    initialData
}: CardModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<number>(0);
    const [timeLimit, setTimeLimit] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const today = new Date().toISOString().split("T")[0];

    const [createCard, { isLoading: isCreating }] = useCreateCardMutation();
    const [updateCard, { isLoading: isUpdating }] = useUpdateCardMutation();
    const isLoading = isCreating || isUpdating;

    const { data: images, isLoading: isImagesLoading } = useGetCardImagesQuery(cardId!, { skip: mode !== "update" || !cardId });
    const [uploadImage, { isLoading: isUploading }] = useUploadCardImageMutation();
    const [deleteImage] = useDeleteCardImageMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || "");
            setDescription(initialData?.description || "");
            setPriority(initialData?.priority || 0);
            setTimeLimit(initialData?.time_limit || "");
            setErrorMsg("");
            setSelectedImage(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && cardId) {
            try {
                await uploadImage({ card_id: cardId, file: e.target.files[0] }).unwrap();
            } catch (err: any) {
                setErrorMsg(err.data?.detail || "Failed to upload image");
            }
        }
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (timeLimit && timeLimit < today) {
            setErrorMsg("Deadline cannot be set in the past.");
            return;
        }

        try {
            if (mode === "create") {
                await createCard({
                    column_id: columnId,
                    title,
                    description,
                    priority,
                    time_limit: timeLimit || undefined
                }).unwrap();
            } else {
                if (!cardId) throw new Error("Card ID required for update");
                await updateCard({
                    id: cardId,
                    title,
                    description,
                    priority,
                    time_limit: timeLimit || undefined
                }).unwrap();
            }
            onClose();
        } catch (err: any) {
            setErrorMsg(err.data?.details[0].field + err.data?.details[0].message.slice(6, -1) || "Failed to save card");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 p-4 font-mono overflow-auto py-10">
            <div className={`bg-[#e8e4d9] border-[3px] border-black w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row transition-all duration-300 ${mode === "update" ? "max-w-4xl" : "max-w-md"}`}>

                <div className={`flex flex-col flex-1 ${mode === "update" ? "md:border-r-[3px] border-black" : ""}`}>
                    <div className="bg-[#2a2a2a] p-4 border-b-[3px] border-black">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                            {mode === "create" ? "Create Card" : "Update Card"}
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                        <Input
                            label="Title"
                            error={errorMsg}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="example: Design UI"
                            required
                        />

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-lg">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add more details..."
                                className="p-3 border-[3px] border-black text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow min-h-[120px] resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-lg">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(Number(e.target.value))}
                                className="p-3 border-[3px] border-black text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-bold bg-white cursor-pointer"
                            >
                                <option value="0">No tag</option>
                                <option value="1" className="text-red-600">High</option>
                                <option value="2" className="text-orange-500">Medium</option>
                                <option value="3" className="text-green-600">Low</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-lg">Deadline</label>
                            <input
                                type="date"
                                min={today}
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(e.target.value)}
                                className="p-3 border-[3px] border-black text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-bold bg-white"
                            />
                        </div>


                        <div className="mt-4 flex justify-between gap-4">
                            <SelectButton type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save"}
                            </SelectButton>
                            <SelectButton
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="bg-[#e8e4d9] !text-black hover:bg-[#d4d0c5] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]"
                            >
                                Cancel
                            </SelectButton>
                        </div>
                    </form>
                </div>

                {mode === "update" && cardId && (
                    <aside className="w-full md:w-[350px] bg-white flex flex-col min-h-[660px] max-h-[80vh] overflow-hidden border-t-[3px] md:border-t-0 border-black">
                        <div className="bg-[#2a2a2a] p-4 border-b-[3px] border-black flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-white tracking-wide">
                                Attachments
                            </h2>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="bg-white text-black font-bold px-3 py-1 text-sm border-[2px] border-black hover:bg-gray-200 active:translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                            >
                                {isUploading ? "Uploading..." : "+ Add Image"}
                            </button>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-5 bg-gray-100">
                            {isImagesLoading && <p className="font-bold text-center mt-5">Loading images...</p>}
                            {!isImagesLoading && images?.length === 0 && (
                                <div className="text-gray-500 font-bold text-center mt-10">No attachments yet</div>
                            )}
                            {images?.map((img: any) => (
                                <div key={img.id} className="relative group border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-1">
                                    <img
                                        src={`${BASE_URL}${img.image_url}`}
                                        alt="Attached"
                                        className="w-full h-auto object-cover max-h-[300px] cursor-zoom-in"
                                        onClick={() => setSelectedImage(`${BASE_URL}${img.image_url}`)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => deleteImage({ card_image_id: img.id, card_id: cardId })}
                                        className="absolute top-3 right-3 bg-red-500 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:scale-110"
                                    >
                                        <Trash size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}
            </div>

            {selectedImage && (
                <ImageModal
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};
