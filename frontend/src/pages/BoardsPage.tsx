import { useState } from 'react';
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useGetBoardsQuery } from "../features/boards/boardsApi";
import { BoardCard } from "../components/ui/BoardCard";
import { AddButton } from "../components/ui/AddButton";
import { SelectButton } from "../components/ui/SelectButton";
import { useNavigate } from "react-router-dom";
import { BoardModal } from "../features/boards/BoardModal";
import { DeleteBoardModal } from "../features/boards/DeleteBoardModal";
import logoUrl from "../assets/logo.svg";

export const BoardsPage = () => {
    const dispatch = useDispatch();
    const { data, isLoading, error } = useGetBoardsQuery();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedBoardId, setSelectedBoardId] = useState<number>(0);
    const [selectedBoardTitle, setSelectedBoardTitle] = useState<string>('');
    const [selectedBoardDescription, setSelectedBoardDescription] = useState<string>('');

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-white font-mono">
            {/* Header */}
            <header className="bg-[#2a2a2a] px-10 py-4 flex items-center justify-between border-b-[4px] border-black">
                <div className="flex items-center gap-4">
                    <img src={logoUrl} alt="image here" className="w-15 h-15" />
                    <h1 className="text-white text-4xl font-bold uppercase tracking-wide">Kaban</h1>
                </div>

                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center justify-between gap-10">
                        <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white"></div>
                        <span className="w-30 text-white text-lg font-bold">User Name</span>
                    </div>

                    <SelectButton
                        onClick={handleLogout}
                        className="!bg-[#e8e4d9] !text-black !border-black min-w-[100px] hover:!bg-[#d4d0c5] !shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
                    >
                        Exit
                    </SelectButton>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-8">
                {isLoading && <div className="text-xl font-bold">Loading boards...</div>}
                {error && <div className="text-xl font-bold text-red-500">Error loading boards</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {data?.boards.map((board) => (
                        <BoardCard
                            key={board.id}
                            title={board.title}
                            description={board.description || ""}
                            columnsCount={0}
                            onSelect={() => console.log('Selected:', board.id)}
                            onSettings={() => {
                                setSelectedBoardId(board.id);
                                setSelectedBoardTitle(board.title);
                                setSelectedBoardDescription(board.description || "");
                                setIsUpdateModalOpen(true);
                            }}
                            onDelete={() => {
                                setSelectedBoardId(board.id);
                                setIsDeleteModalOpen(true);
                            }}
                        />
                    ))}

                    <div className="max-w-sm h-[140px]">
                        <AddButton onClick={() => setIsCreateModalOpen(true)} className="h-full w-full text-xl">
                            + Add board
                        </AddButton>
                    </div>
                </div>
            </main>

            <BoardModal
                mode="create"
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <BoardModal
                mode="update"
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                id={selectedBoardId}
                initialTitle={selectedBoardTitle}
                initialDescription={selectedBoardDescription}
            />
            <DeleteBoardModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                id={selectedBoardId}
            />
        </div>
    );
};
