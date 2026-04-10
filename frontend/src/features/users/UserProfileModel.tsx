import { useState, useEffect, useRef } from "react";
import { SelectButton } from "../../components/ui/SelectButton";
import { useGetMeQuery, useUpdateUserMutation, useUploadAvatarMutation } from "./userApi";
import { Input } from "../../components/ui/Input";
import { UserAvatar } from "../../components/ui/UserAvatar";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export const UserProfileModal = ({ isOpen, onClose }: UserProfileModalProps) => {

    if (!isOpen) return null;

    const { data } = useGetMeQuery();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [username, setUsername] = useState(data?.username);
    const [email, setEmail] = useState(data?.email);
    const [password, setPassword] = useState('');
    const [user_icon, setUserIcon] = useState(data?.user_icon);
    const [errorMsg, setErrorMsg] = useState('');

    const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
    const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();


    useEffect(() => {
        if (isOpen && data) {
            setUsername(data.username);
            setEmail(data.email);
            setUserIcon(data.user_icon);
            setPassword('');
            setErrorMsg('');
        }
    }, [isOpen, data]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');


        const payload: any = { username };

        if (password) {
            payload.password = password;
        }

        try {
            await updateUser(payload).unwrap();
            setUsername(username);
            setUserIcon(user_icon);
            setPassword('');
            setErrorMsg('');
            onClose();
        } catch (err: any) {
            setErrorMsg(err.data?.details[0].message || err.data?.detail || 'Failed to update user');
        }


    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            try {
                await uploadAvatar(file).unwrap();
            } catch (err) {
                console.error("Failed to upload avatar", err);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-[#e8e4d9] border-[3px] border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-[#2d2d2d] text-white px-6 py-4 flex-col items-right">
                    <h2 className="text-xl font-bold mb-2 uppercase">User Profile</h2>
                    <p className="text-xl font-bold mb-2">{email}</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                    <div
                        className="relative cursor-pointer w-16 h-16 rounded-full hover:opacity-80 transition"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UserAvatar userIcon={data?.user_icon} username={data?.username} className="w-16 h-16 text-xl" />

                        {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white text-xs">
                                Loading...
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <Input
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <Input
                        label="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                    />

                    {errorMsg && <p className="text-red-600 font-bold font-mono">{errorMsg}</p>}

                    <div className="mt-6 flex justify-between gap-4">
                        <SelectButton type="submit" disabled={isUpdatingUser}>
                            {isUpdatingUser ? "Loading..." : "Update"}
                        </SelectButton>
                        <SelectButton
                            type="button"
                            onClick={onClose}
                            disabled={isUpdatingUser}
                            className="bg-[#e8e4d9] !text-black hover:bg-[#d4d0c5] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]"
                        >
                            Cancel
                        </SelectButton>
                    </div>
                </form>

            </div>
        </div>
    );
};