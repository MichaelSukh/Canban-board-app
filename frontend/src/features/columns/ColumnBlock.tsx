import { useGetCardsQuery, useUpdateCardMutation } from '../cards/cardsApi';
import { Column as ColumnUI } from '../../components/ui/Column';
import { Card as CardUI } from '../../components/ui/Card';
import { CardModal } from '../cards/CardModal';
import { DeleteCardModal } from '../cards/DeleteCardModal';
import { useState } from 'react';
import type { Column } from './columnsApi';

interface ColumnBlockProps {
    column: Column;
    onEditColumn?: (id: number, title: string) => void;
    onDeleteColumn?: (id: number) => void;
}

export const ColumnBlock = ({ column, onEditColumn, onDeleteColumn }: ColumnBlockProps) => {
    const { data, isLoading, error } = useGetCardsQuery(column.id);
    const [updateCard] = useUpdateCardMutation();

    const is404Error = error && (error as any).status === 404;

    const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
    const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
    const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false);

    const [selectedCardId, setSelectedCardId] = useState<number>(0);
    const [selectedCardData, setSelectedCardData] = useState({ title: '', description: '', priority: 0, time_limit: '' });

    return (
        <>
            <ColumnUI
                title={column.title}
                cardsCount={data?.total_cards || 0}
                onAddCard={() => setIsCreateCardOpen(true)}
                onSettings={() => onEditColumn?.(column.id, column.title)}
                onDelete={() => onDeleteColumn?.(column.id)}
            >
                {isLoading && <div className="text-sm font-bold text-gray-500 text-center">Loading cards...</div>}

                {!isLoading && !is404Error && data?.cards.map(card => (
                    <CardUI
                        key={card.id}
                        title={card.title}
                        description={card.description}
                        date={card.time_limit}
                        tags={card.priority || 0}
                        onTagChange={(newTag) => {
                            updateCard({ id: card.id, priority: newTag });
                        }}
                        onSelect={() => {
                            setSelectedCardId(card.id);
                            setSelectedCardData({
                                title: card.title,
                                description: card.description || '',
                                priority: card.priority || 0,
                                time_limit: card.time_limit || ''
                            });
                            setIsUpdateCardOpen(true);
                        }}
                        onDelete={() => {
                            setSelectedCardId(card.id);
                            setIsDeleteCardOpen(true);
                        }}
                    />
                ))}
            </ColumnUI>

            <CardModal
                isOpen={isCreateCardOpen}
                onClose={() => setIsCreateCardOpen(false)}
                mode="create"
                columnId={column.id}
            />

            <CardModal
                isOpen={isUpdateCardOpen}
                onClose={() => setIsUpdateCardOpen(false)}
                mode="update"
                columnId={column.id}
                cardId={selectedCardId}
                initialData={selectedCardData}
            />

            <DeleteCardModal
                isOpen={isDeleteCardOpen}
                onClose={() => setIsDeleteCardOpen(false)}
                cardId={selectedCardId}
            />
        </>
    );
};
