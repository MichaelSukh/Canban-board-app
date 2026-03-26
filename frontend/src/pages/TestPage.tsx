import { BoardCard } from "../components/ui/BoardCard";

export const TestPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <BoardCard title="Test Board" columnsCount={3} />
        </div>
    )
}