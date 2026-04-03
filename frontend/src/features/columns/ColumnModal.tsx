import React, { useState, useEffect } from "react";
import { useCreateColumnMutation, useUpdateColumnMutation } from "./columnsApi";
import { Input } from "../../components/ui/Input";
import { SelectButton } from "../../components/ui/SelectButton";

interface ColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "update";
    boardId: number;
    columnId?: number;
    initialTitle?: string;
}

export const ColumnModal = ({
    isOpen,
    onClose,
    mode,
    boardId,
    columnId,
    initialTitle = ""
}: ColumnModalProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [errorMsg, setErrorMsg] = useState('');

    const [createColumn, { isLoading: isCreating }] = useCreateColumnMutation();
    const [updateColumn, { isLoading: isUpdating }] = useUpdateColumnMutation();

    const isLoading = isCreating || isUpdating;

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setErrorMsg('');
        }
    }, [isOpen, initialTitle]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            if (mode === "create") {
                await createColumn({ board_id: boardId, title }).unwrap();
            } else {
                if (!columnId) throw new Error("Column ID is required for update");
                await updateColumn({ id: columnId, title }).unwrap();
            }
            onClose();
        } catch (err: any) {
            setErrorMsg(err.data?.detail || err.data?.message || err.error || "Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-[#e8e4d9] border-[3px] border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-[#2a2a2a] p-4 border-b-[3px] border-black">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                        {mode === "create" ? "Create Column" : "Update Column"}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <Input
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="example: In Progress"
                    />

                    {errorMsg && <p className="text-red-600 font-bold">{errorMsg}</p>}

                    <div className="mt-6 flex justify-between gap-4">
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
        </div>
    );
};
