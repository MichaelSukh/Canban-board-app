import { BoardCard } from "../components/ui/BoardCard";

export const TestPage = () => {
    return (
        <div className="flex items-center justify-center h-screen gap-4">
            <BoardCard title="Test Board" columnsCount={3} description="Доска для тестирования" />
            <BoardCard title="Test Board" columnsCount={3} description="Доска для тестирования" />
            <BoardCard title="Test Board" columnsCount={3} description="Доска для тестирования" />
        </div>
    )
}