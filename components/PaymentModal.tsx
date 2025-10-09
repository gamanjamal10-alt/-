import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: 'BaridiMob' | 'CCP';
  onSubmit: () => Promise<void>;
}

// Mock correct payment details
const MOCK_BARIDIMOB_CARD = '1234567812345678';
const MOCK_BARIDIMOB_OTP = '123456';
const MOCK_CCP_ACCOUNT = '1234567890';
const MOCK_CCP_KEY = '12';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, method, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // BaridiMob fields
  const [cardNumber, setCardNumber] = useState('');
  const [otp, setOtp] = useState('');

  // CCP fields
  const [ccpAccount, setCcpAccount] = useState('');
  const [ccpKey, setCcpKey] = useState('');

  useEffect(() => {
    // Reset fields when modal opens or method changes
    if (isOpen) {
      setError('');
      setIsLoading(false);
      setCardNumber('');
      setOtp('');
      setCcpAccount('');
      setCcpKey('');
    }
  }, [isOpen, method]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // --- MOCK VALIDATION ---
    if (method === 'BaridiMob') {
      if (cardNumber !== MOCK_BARIDIMOB_CARD || otp !== MOCK_BARIDIMOB_OTP) {
        setError('معلومات بطاقة بريدي موب أو رمز OTP غير صحيحة.');
        return;
      }
    } else if (method === 'CCP') {
      if (ccpAccount !== MOCK_CCP_ACCOUNT || ccpKey !== MOCK_CCP_KEY) {
        setError('رقم حساب CCP أو المفتاح غير صحيح.');
        return;
      }
    }
    // --- END MOCK VALIDATION ---

    setIsLoading(true);
    try {
      await onSubmit();
    } catch (apiError) {
      setError('فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBaridiMobForm = () => (
    <>
      <p className="text-gray-600 mb-4">أدخل معلومات بطاقة الذهبية الخاصة بك لإتمام الدفع.</p>
      <Input
        id="cardNumber"
        label="رقم البطاقة"
        type="text"
        value={cardNumber}
        onChange={e => setCardNumber(e.target.value)}
        placeholder="1234567812345678"
        required
      />
      <Input
        id="otp"
        label="رمز التحقق (OTP)"
        type="text"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        placeholder="123456"
        required
      />
    </>
  );

  const renderCCPForm = () => (
    <>
      <p className="text-gray-600 mb-4">أدخل معلومات حسابك البريدي الجاري لإتمام الدفع.</p>
      <Input
        id="ccpAccount"
        label="رقم الحساب (بدون المفتاح)"
        type="text"
        value={ccpAccount}
        onChange={e => setCcpAccount(e.target.value)}
        placeholder="1234567890"
        required
      />
      <Input
        id="ccpKey"
        label="المفتاح"
        type="text"
        value={ccpKey}
        onChange={e => setCcpKey(e.target.value)}
        placeholder="12"
        required
      />
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">الدفع عبر {method}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {method === 'BaridiMob' ? renderBaridiMobForm() : renderCCPForm()}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="pt-4 flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              إلغاء
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              تأكيد الدفع
            </Button>
          </div>
           <p className="mt-4 text-xs text-center text-gray-500">
             هذه عملية دفع تجريبية. استخدم البيانات الوهمية المكتوبة في الحقول.
           </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
