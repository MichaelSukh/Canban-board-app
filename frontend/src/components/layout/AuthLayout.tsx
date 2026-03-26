import type { ReactNode } from 'react';

interface AuthLayoutProps {
    leftTitle: string;
    leftIcon?: ReactNode;
    children: ReactNode;
}

export const AuthLayout = ({ leftTitle, leftIcon, children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-mono">
            <div className="hidden md:flex flex-col items-center justify-center bg-[#2c2c2c] text-white p-12">
                <div className="flex flex-col items-center gap-6">
                    {leftIcon && <div className="text-white">{leftIcon}</div>}
                    <h1 className="text-5xl font-bold uppercase tracking-widest text-center p-4">
                        {leftTitle}
                    </h1>
                </div>
            </div>

            <div className="flex items-center justify-center bg-white p-6">
                <div className="w-full max-w-md bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
                    {children}
                </div>
            </div>
        </div>
    );
};