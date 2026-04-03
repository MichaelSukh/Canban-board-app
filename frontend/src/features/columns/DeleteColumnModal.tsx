import { useDeleteColumnMutation } from "./columnsApi";
import { SelectButton } from "../../components/ui/SelectButton";
import { useState, useEffect } from "react";

interface DeleteColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    columnId: number;
}

export const DeleteColumnModal = ({ isOpen, onClose, columnId }: DeleteColumnModalProps) => {
    const [deleteColumn, { isLoading }] = useDeleteColumnMutation();
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isOpen) setErrorMsg('');
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDelete = async () => {
        try {
            await deleteColumn(columnId).unwrap();
            onClose();
        } catch (err: any) {
            setErrorMsg(err.data?.detail || err.data?.message || err.error || "Failed to delete");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-[#e8e4d9] border-[3px] border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-[#2a2a2a] p-4 border-b-[3px] border-black">
                    <h2 className="text-2xl font-bold text-red-500 uppercase tracking-wide">
                        Warning
                    </h2>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <p className="text-lg font-bold">
                        Are you sure you want to delete this column? All cards inside will be permanently lost!
                    </p>

                    {errorMsg && <p className="text-red-600 font-bold">{errorMsg}</p>}

                    <div className="mt-6 flex justify-between gap-4">
                        <SelectButton 
                            onClick={handleDelete} 
                            disabled={isLoading}
                            className="!bg-red-500 hover:!bg-red-700 !text-white"
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </SelectButton>
                        <SelectButton
                            onClick={onClose}
                            disabled={isLoading}
                            className="bg-[#e8e4d9] !text-black hover:bg-[#d4d0c5] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]"
                        >
                            Cancel
                        </SelectButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
