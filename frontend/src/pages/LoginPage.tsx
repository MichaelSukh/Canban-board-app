import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { SelectButton } from '../components/ui/SelectButton';
import { useLoginMutation } from '../features/auth/authApi';
import { useAppDispatch } from '../hooks/redux';
import { setCredentials } from '../features/auth/authSlice';
import { LogIn } from 'lucide-react';

export const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', data.email);
            formData.append('password', data.password);

            const result = await login(formData).unwrap();
            console.log(result);
            dispatch(setCredentials(result));
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to login:', err);
        }
    };

    return (
        <AuthLayout
            leftTitle="Welcome Back"
            leftIcon={<LogIn size={120} strokeWidth={1.5} />}
        >
            <div className="flex flex-col gap-1">
                <h2 className="text-4xl font-bold font-mono">Login</h2>
                <p className="text-gray-500 font-mono text-sm">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="example@gmail.com"
                    error={errors.email?.message}
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
                        minLength: { value: 6, message: 'Min length is 6 characters' },
                        maxLength: { value: 72, message: 'Max length is 72 characters' }
                    })}
                />

                <SelectButton type="submit" isLoading={isLoading} className="mt-4">
                    SIGN IN
                </SelectButton>
            </form>

            <div className="border-t-2 border-black border-dotted pt-4 flex justify-between items-center font-mono text-sm">
                <span>Don't have an account?</span>
                <Link to="/register" className="font-bold underline hover:text-black transition-colors">
                    Create account
                </Link>
            </div>
        </AuthLayout>
    );
};