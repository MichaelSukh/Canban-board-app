import { useState, useEffect } from 'react';
import { useCreateBoardMutation, useUpdateBoardMutation } from './boardsApi';
import { Input } from '../../components/ui/Input';
import { SelectButton } from '../../components/ui/SelectButton';

interface BoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'update';
    id?: number;
    initialTitle?: string;
    initialDescription?: string;
}

export const BoardModal = ({
    isOpen,
    onClose,
    mode,
    id,
    initialTitle = '',
    initialDescription = ''
}: BoardModalProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [errorMsg, setErrorMsg] = useState('');

    const [createBoard, { isLoading: isCreating }] = useCreateBoardMutation();
    const [updateBoard, { isLoading: isUpdating }] = useUpdateBoardMutation();

    const isUpdate = mode === 'update';
    const isLoading = isUpdate ? isUpdating : isCreating;

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setDescription(initialDescription);
            setErrorMsg('');
        }
    }, [isOpen, initialTitle, initialDescription]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');

        if (title.length < 4 || title.length > 30) {
            setErrorMsg('Title must be between 4 and 30 characters');
            return;
        }

        try {
            if (isUpdate && id !== undefined) {
                await updateBoard({ id, title, description }).unwrap();
            } else {
                await createBoard({ title, description }).unwrap();
            }
            setTitle('');
            setDescription('');
            onClose();
        } catch (err: any) {
            setErrorMsg(err.data?.detail || `Failed to ${mode} board`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-white border-[3px] border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-[#2d2d2d] text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold uppercase tracking-wider">
                        {isUpdate ? 'Update Board' : 'Create Board'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <Input
                        label="Board Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Next Project"
                        required
                    />

                    <div className="w-full flex-col gap-2 flex max-w-sm">
                        <label className="font-mono font-bold text-black uppercase tracking-wider">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed description..."
                            className="w-full px-4 py-3 bg-[#e8e4d9] border-[3px] border-black 
                                font-mono text-black placeholder:text-[#909090] 
                                outline-none transition-transform
                                focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgb(0,0,0)]
                                resize-none h-24"
                        />
                    </div>

                    {errorMsg && <p className="text-red-600 font-bold font-mono">{errorMsg}</p>}

                    <div className="flex gap-4 mt-6">
                        <SelectButton type="submit" isLoading={isLoading}>
                            {isUpdate ? 'Update' : 'Create'}
                        </SelectButton>
                        <SelectButton
                            type="button"
                            onClick={onClose}
                            className="bg-[#e8e4d9] !text-black hover:bg-[#d4d0c5] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]"
                        >
                            Cancel
                        </SelectButton>
                    </div>
                </form>
            </div >
        </div >
    );
};
