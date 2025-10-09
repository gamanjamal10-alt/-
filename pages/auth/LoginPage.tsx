import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من معلوماتك.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        <Link to="/">سوق الفلاح</Link>
                    </h1>
                    <p className="text-gray-600 mt-2">تسجيل الدخول إلى لوحة التحكم</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="email"
                        label="البريد الإلكتروني أو رقم الهاتف"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        id="password"
                        label="كلمة المرور"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        تسجيل الدخول
                    </Button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    ليس لديك حساب؟{' '}
                    <Link to="/register" className="font-medium text-gray-700 hover:text-gray-600">
                        أنشئ متجرك الآن
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;