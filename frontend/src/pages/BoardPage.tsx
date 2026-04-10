import { useState } from "react";
import { useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { UserAvatar } from "../components/ui/UserAvatar";
import { SelectButton } from "../components/ui/SelectButton";
import { AddButton } from "../components/ui/AddButton";
import logoUrl from "../assets/logo.svg";
import { useGetMeQuery } from "../features/users/userApi";
import { logout } from "../features/auth/authSlice";
import { UserProfileModal } from "../features/users/UserProfileModel";
import { useGetColumnsQuery } from "../features/columns/columnsApi";
import { ColumnBlock } from "../features/columns/ColumnBlock";
import { ColumnModal } from "../features/columns/ColumnModal";
import { DeleteColumnModal } from "../features/columns/DeleteColumnModal";
import { useGetBoardsQuery } from "../features/boards/boardsApi";

export const BoardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: currentUser } = useGetMeQuery();

    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

    const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
    const [isUpdateColumnOpen, setIsUpdateColumnOpen] = useState(false);
    const [isDeleteColumnOpen, setIsDeleteColumnOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<number>(0);
    const [selectedColumnTitle, setSelectedColumnTitle] = useState<string>('');

    const userName = currentUser?.username || 'Loading...';
    const isLongName = userName.length > 20;

    const { boardId } = useParams();

    const { data: boardsData } = useGetBoardsQuery();
    const currentBoard = boardsData?.boards.find(b => b.id === Number(boardId));
    const boardTitle = currentBoard?.title || "Loading Board...";

    const { data: columnsData, isLoading, error } = useGetColumnsQuery(Number(boardId));
    const is404Error = error && (error as any).status === 404;

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="h-screen w-full bg-white font-mono flex flex-col overflow-hidden">
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
            <main className="p-4 flex flex-col flex-1 overflow-hidden">
                <div className="w-full flex justify-left mb-4 font-mono shrink-0">
                    <div className="flex bg-[#2a2a2a] text-[#e8e4d9] rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <button
                            onClick={() => navigate('/boards')}
                            className="px-5 py-2 flex items-center justify-center
                                    font-bold text-[20px] rounded-lg 
                                    hover:bg-white hover:text-black transition-colors 
                                    border-[3px] border-black bg-[#1a1a1a]"
                            title="Back to boards"
                        >
                            {`<=`}
                        </button>
                        <span className="text-2xl font-bold px-8 py-3 flex items-center bg-[#2a2a2a]">
                            {boardTitle}
                        </span>
                    </div>
                </div>

                {isLoading &&
                    <div className="w-full text-center mb-8">
                        <span className="text-2xl font-bold text-[#e8e4d9] bg-[#2a2a2a] px-6 py-2 rounded-lg">
                            Loading columns...
                        </span>
                    </div>
                }

                {is404Error && (
                    <div className="w-full text-center mb-8">
                        <span className="text-2xl font-bold text-[#e8e4d9] bg-[#2a2a2a] px-6 py-2 rounded-lg">
                            You haven`t columns yet
                        </span>
                    </div>
                )}

                <div className={`${isLoading || is404Error ? "flex justify-center flex-1" : "flex gap-8 overflow-x-auto overflow-y-hidden pb-4 items-start flex-1"}`}>

                    {!is404Error && columnsData?.columns.map(column => (
                        <div key={column.id} className="shrink-0 w-[350px] max-h-full flex flex-col">
                            <ColumnBlock
                                column={column}
                                onEditColumn={(id, title) => {
                                    setSelectedColumnId(id);
                                    setSelectedColumnTitle(title);
                                    setIsUpdateColumnOpen(true);
                                }}
                                onDeleteColumn={(id) => {
                                    setSelectedColumnId(id);
                                    setIsDeleteColumnOpen(true);
                                }}
                            />
                        </div>
                    ))}

                    <div className="shrink-0 w-[350px] h-[100px]">
                        <AddButton onClick={() => setIsCreateColumnOpen(true)} className="h-full w-full text-xl">
                            + Add column
                        </AddButton>
                    </div>
                </div>
            </main>

            {/* Modals for Columns */}
            <ColumnModal
                isOpen={isCreateColumnOpen}
                onClose={() => setIsCreateColumnOpen(false)}
                mode="create"
                boardId={Number(boardId)}
            />

            <ColumnModal
                isOpen={isUpdateColumnOpen}
                onClose={() => setIsUpdateColumnOpen(false)}
                mode="update"
                boardId={Number(boardId)}
                columnId={selectedColumnId}
                initialTitle={selectedColumnTitle}
            />

            <DeleteColumnModal
                isOpen={isDeleteColumnOpen}
                onClose={() => setIsDeleteColumnOpen(false)}
                columnId={selectedColumnId}
            />

            <UserProfileModal
                isOpen={isUserProfileOpen}
                onClose={() => setIsUserProfileOpen(false)}
            />
        </div>
    );
};