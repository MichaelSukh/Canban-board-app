import { useGetCardsQuery } from '../cards/cardsApi';
import { Column as ColumnUI } from '../../components/ui/Column';
import { Card as CardUI } from '../../components/ui/Card';
import type { Column } from './columnsApi';

interface ColumnBlockProps {
    column: Column;
    onEditColumn?: (id: number, title: string) => void;
    onDeleteColumn?: (id: number) => void;
}

export const ColumnBlock = ({ column, onEditColumn, onDeleteColumn }: ColumnBlockProps) => {
    const { data, isLoading, error } = useGetCardsQuery(column.id);

    const is404Error = error && (error as any).status === 404;

    return (
        <ColumnUI
            title={column.title}
            cardsCount={data?.total_cards || 0}
            onAddCard={() => console.log('Add card to', column.id)}
            onSettings={() => onEditColumn?.(column.id, column.title)}
            onDelete={() => onDeleteColumn?.(column.id)}
        >
            {isLoading && <div className="text-sm font-bold text-gray-500 text-center">Loading cards...</div>}

            {!isLoading && !is404Error && data?.cards.map(card => (
                <CardUI
                    key={card.id}
                    title={card.title}
                    description={card.description}
                    tags={card.priority || 0}
                    onDelete={() => console.log('Delete card', card.id)}
                />
            ))}
        </ColumnUI>
    );
};
