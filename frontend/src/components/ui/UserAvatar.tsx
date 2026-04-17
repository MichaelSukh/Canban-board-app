import React from 'react';
import { BASE_URL } from '../../services/api';

interface UserAvatarProps {
    userIcon?: string | null;
    username?: string;
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
    userIcon,
    username,
    className = "w-16 h-16 text-xl"
}) => {
    if (userIcon) {
        return (
            <img
                src={`${BASE_URL}${userIcon}`}
                alt="User avatar"
                className={`rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <div className={`rounded-full bg-gray-300 flex items-center justify-center font-bold border-2 border-black ${className}`}>
            {username?.slice(0, 2).toUpperCase()}
        </div>
    );
};
