import { useState } from 'react';
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useGetBoardsQuery } from "../features/boards/boardsApi";
import { useGetMeQuery } from "../features/users/userApi";
import { BoardCard } from "../components/ui/BoardCard";
import { AddButton } from "../components/ui/AddButton";
import { SelectButton } from "../components/ui/SelectButton";
import { useNavigate } from "react-router-dom";
import { BoardModal } from "../features/boards/BoardModal";
import { DeleteBoardModal } from "../features/boards/DeleteBoardModal";
import { UserProfileModal } from '../features/users/UserProfileModel';
import { UserAvatar } from '../components/ui/UserAvatar';
import logoUrl from "../assets/logo.svg";

export const BoardsPage = () => {
    const dispatch = useDispatch();
    const { data, isLoading, error } = useGetBoardsQuery();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

    const [selectedBoardId, setSelectedBoardId] = useState<number>(0);
    const [selectedBoardTitle, setSelectedBoardTitle] = useState<string>('');
    const [selectedBoardDescription, setSelectedBoardDescription] = useState<string>('');

    const { data: currentUser } = useGetMeQuery();
    const userName = currentUser?.username || 'Loading...';
    const isLongName: boolean = userName.length > 20;

    const navigate = useNavigate();

    let is404Error = false;

    if (error) {
        const err: any = error;
        if (err.status === 404) {
            is404Error = true;
        }
    }

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
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center justify-center w-[56px] h-[56px] bg-gray-300 rounded-full border-[3px] border-white">
                            <UserAvatar userIcon={currentUser?.user_icon} username={currentUser?.username} className="w-[50px] h-[50px] text-lg" />
                        </div>
                        <button onClick={() => setIsUserProfileOpen(true)}
                            className="flex items-center justify-center h-[42px]
                                        border-2 border-white
                                        transition-all duration-400 
                                        hover:shadow-[4px_4px_0px_0px_rgba(170,170,170,0.8)]">
                            <span className="w-full max-w-[200px] text-white font-bold m-2 text-md">
                                {isLongName ? userName.slice(0, 18) + '...' : userName}
                            </span>
                        </button>
                    </div>

                    <SelectButton
                        onClick={handleLogout}
                        className="!h-[42px] !bg-[#e8e4d9] !text-black !border-none !shadow-none hover:!shadow-[4px_4px_0px_0px_rgba(170,170,170,0.8)]"
                    >
                        Exit
                    </SelectButton>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-8 relative">
                {isLoading && <div className="text-xl font-bold">Loading boards...</div>}

                {is404Error && (
                    <div className="w-full text-center mb-8">
                        <span className="text-2xl font-bold text-[#e8e4d9] bg-[#2a2a2a] px-6 py-2 rounded-lg">
                            You haven`t board yet
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {!is404Error && [...(data?.boards || [])].sort((a, b) => a.id - b.id).map((board) => (
                        <BoardCard
                            key={board.id}
                            title={board.title}
                            description={board.description || ""}
                            columnsCount={board.columns_count}
                            onSelect={() => navigate(`/board/${board.id}`)}
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
            <UserProfileModal
                isOpen={isUserProfileOpen}
                onClose={() => setIsUserProfileOpen(false)}
            />
        </div>
    );
};
