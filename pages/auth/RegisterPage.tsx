
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { StoreType } from '../../types';

const RegisterPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [storeType, setStoreType] = useState<StoreType>(StoreType.FARMER);
    const [otp, setOtp] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleFirstStep = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock OTP sending and move to next step
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1000);
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock registration and redirect
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, you would now log the user in
            alert('تم التسجيل بنجاح! سيتم تحويلك لصفحة الدخول.');
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800">
                        <Link to="/">سوق الفلاح</Link>
                    </h1>
                    <p className="text-gray-600 mt-2">إنشاء متجر جديد</p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleFirstStep} className="space-y-6">
                        <Input id="email" label="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Input id="phone" label="رقم الهاتف" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        <Input id="password" label="كلمة المرور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Input id="confirmPassword" label="تأكيد كلمة المرور" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <div>
                          <label htmlFor="storeType" className="block text-sm font-medium text-gray-700 mb-1">نوع المتجر</label>
                          <select id="storeType" value={storeType} onChange={(e) => setStoreType(e.target.value as StoreType)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                            {Object.values(StoreType).map(type => <option key={type} value={type}>{type}</option>)}
                          </select>
                        </div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            التالي
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleFinalSubmit} className="space-y-6">
                        <p className="text-center">تم إرسال رمز التحقق إلى {phone}.</p>
                        <Input id="otp" label="رمز التحقق (OTP)" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        <div className="text-center p-4 bg-gray-200 rounded-md">
                            <p className="font-mono tracking-widest text-xl select-none">aB5x8P</p>
                            <label htmlFor="captcha" className="sr-only">Captcha</label>
                        </div>
                        <Input id="captcha" label="أدخل الرمز أعلاه (Captcha)" type="text" value={captcha} onChange={(e) => setCaptcha(e.target.value)} required />
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            إنشاء الحساب
                        </Button>
                    </form>
                )}
                
                <p className="mt-6 text-center text-sm text-gray-600">
                    لديك حساب بالفعل؟{' '}
                    <Link to="/login" className="font-medium text-green-700 hover:text-green-600">
                        سجل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
