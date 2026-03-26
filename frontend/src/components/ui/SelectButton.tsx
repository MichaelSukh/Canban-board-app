import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface SelectButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    isLoading?: boolean;
}

export const SelectButton = ({
    children,
    isLoading,
    className = '',
    disabled,
    ...props
}: SelectButtonProps) => {

    return (
        <button
            disabled={isLoading || disabled}
            className={`
                w-full px-4 py-2 max-w-sm
                bg-[#2d2d2d] text-white
                transition-all duration-400 
                hover:bg-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]
                focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]
                font-mono font-bold text-white flex items-center justify-center gap-2
                disabled:cursor-not-allowed
                ${isLoading ? 'translate-y-0 hover:bg-black hover:shadow-none' : ''}
                ${className}
            `}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {children}
        </button>
    );
};