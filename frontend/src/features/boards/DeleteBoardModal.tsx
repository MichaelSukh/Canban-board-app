import { useState } from 'react';
import { useDeleteBoardMutation } from './boardsApi';
import { SelectButton } from '../../components/ui/SelectButton';

interface DeleteBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    id: number;
}

export const DeleteBoardModal = ({ isOpen, onClose, id }: DeleteBoardModalProps) => {
    const [deleteBoard, { isLoading }] = useDeleteBoardMutation();
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleDelete = async () => {
        setErrorMsg('');
        try {
            await deleteBoard(id).unwrap();
            onClose();
        } catch {
            setErrorMsg('Failed to delete board');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-white border-[3px] border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-[#2d2d2d] text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold uppercase tracking-wider">Delete Board</h2>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <p className="text-lg text-black font-bold">
                        Are you sure you want to delete this board? This action cannot be canceled.
                    </p>

                    {errorMsg && <p className="text-red-600 font-bold font-mono">{errorMsg}</p>}

                    <div className="flex gap-4 mt-6">
                        <SelectButton
                            type="button"
                            onClick={handleDelete}
                            isLoading={isLoading}
                            className="!bg-[#e83b3b] !text-white hover:!bg-[#b32b2b]"
                        >
                            Delete
                        </SelectButton>
                        <SelectButton
                            type="button"
                            onClick={onClose}
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
