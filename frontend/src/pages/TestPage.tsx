import { Card } from "../components/ui/Card"
import { Column } from "../components/ui/Column"

export const TestPage = () => {
    return (
        <div className="flex items-center justify-center h-screen gap-4">
            <Column title="Test Column" cardsCount={3} />
            <Card title="Test Card" description="qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" date="04/03" tags={3} />
        </div>
    )
}