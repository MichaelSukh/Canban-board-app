import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { SelectButton } from '../components/ui/SelectButton';
import { useRegisterMutation, useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { UserPlus } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [emailError, setEmailError] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password = watch('password');

    const onSubmit = async (data: any) => {
        try {

            const { confirmPassword, ...registerData } = data;

            const result = await registerUser(registerData).unwrap();
            console.log(result);


            const formData = new URLSearchParams();
            formData.append('username', data.email);
            formData.append('password', data.password);

            const creditials = await login(formData).unwrap();
            dispatch(setCredentials(creditials));
            navigate('/boards');
        } catch (err: any) {
            setEmailError(err?.data?.detail || 'Unknown error');
            console.error('Failed to register:', err);
        }
    };

    return (
        <AuthLayout
            leftTitle="Join Us"
            leftIcon={<UserPlus size={120} strokeWidth={1.5} />}
        >
            <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-bold font-mono">Register</h2>
                <p className="text-gray-500 font-mono text-sm">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                <Input
                    label="Full Name"
                    placeholder="Ivanov Ivan"
                    error={errors.username?.message}
                    {...register('username', {
                        required: 'Full name is required',
                        minLength: { value: 3, message: 'Min length is 3 characters' },
                        maxLength: { value: 50, message: 'Max length is 50 characters' }
                    })}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="example@gmail.com"
                    error={emailError || errors.email?.message}
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/,
                            message: 'Invalid email format'
                        }
                    })}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="****************"
                    error={errors.password?.message}
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Min length is 8 characters' },
                        maxLength: { value: 72, message: 'Max length is 72 characters' }
                    })}
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="****************"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', {
                        required: 'Confirm password is required',
                        validate: (value) => value === password || 'Passwords do not match'
                    })}
                />

                <SelectButton type="submit" isLoading={isLoading && isLoginLoading} className="mt-4">
                    SIGN UP
                </SelectButton>
            </form>

            <div className="border-t-2 border-black border-dotted pt-4 flex justify-between items-center font-mono text-sm">
                <span>Already have an account?</span>
                <Link to="/login" className="font-bold underline hover:text-black transition-colors">
                    Login
                </Link>
            </div>
        </AuthLayout>
    );
};