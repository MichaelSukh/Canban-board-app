import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface AddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    isLoading?: boolean;
}

export const AddButton = ({
    children,
    isLoading,
    className = '',
    disabled,
    ...props
}: AddButtonProps) => {

    return (
        <button
            disabled={isLoading || disabled}
            className={`
                w-full px-4 py-2 max-w-sm 
                transition-all duration-400
                bg-[#e8e4d9] border-[2px] border-black border-dashed 
                hover:bg-[#d4d0c5] hover:border-solid
                font-mono font-bold text-black flex items-center justify-center gap-2
                disabled:cursor-not-allowed
                ${isLoading ? 'hover:border-dashed' : ''}
                ${className}
            `}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : null}
            {children}
        </button>
    );
};