import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full max-w-sm flex flex-col gap-2">
                {label && (
                    <label className="font-mono font-bold text-black uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-3 bg-[#e8e4d9] border-[3px] border-black 
                        font-mono text-black placeholder:text-[#909090] 
                        outline-none transition-transform
                        focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgb(0,0,0)]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? 'border-red-900 focus:shadow-[4px_4px_0px_0px_rgb(114,0,0)]' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <span className="font-mono text-red-900">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';