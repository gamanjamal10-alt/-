import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { register } from '../../services/api';

const RegisterPage: React.FC = () => {
    const [storeName, setStoreName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }

        if (password.length < 6) {
            setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
            return;
        }

        setIsLoading(true);

        try {
            await register({ storeName, email, phone, password });
            alert('تم إنشاء متجرك بنجاح! وهو الآن ظاهر للعامة لفترة تجريبية مدتها 30 يومًا. سيتم توجيهك لصفحة تسجيل الدخول.');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center py-12">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800">
                        <Link to="/">سوق الفلاح</Link>
                    </h1>
                    <p className="text-green-800 mt-2">إنشاء متجر جديد</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        id="storeName"
                        label="اسم المتجر"
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        required
                    />
                    <Input
                        id="email"
                        label="البريد الإلكتروني"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                     <Input
                        id="phone"
                        label="رقم الهاتف"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                    <Input
                        id="confirmPassword"
                        label="تأكيد كلمة المرور"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        إنشاء حساب
                    </Button>
                </form>
                <p className="mt-6 text-center text-sm text-green-800">
                    لديك حساب بالفعل؟{' '}
                    <Link to="/login" className="font-medium text-green-800 hover:text-green-700">
                        تسجيل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;