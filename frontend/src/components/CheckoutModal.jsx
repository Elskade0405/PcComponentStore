import React, { useState, useEffect } from 'react';
import { X, User, CreditCard, ShoppingBag, ShieldCheck, ArrowLeft, QrCode, CreditCard as CardIcon, Banknote, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import API_URL from '../config';

const CheckoutModal = ({ isOpen, onClose }) => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [gender, setGender] = useState('anh');
    const [deliveryType, setDeliveryType] = useState('home');
    const [currentStep, setCurrentStep] = useState(1);
    
    // User info states
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    
    // Delivery info states
    const [addressLine, setAddressLine] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    
    const [orderId, setOrderId] = useState('');
    const backendUrl = API_URL;

    useEffect(() => {
        // Generate a random order ID on mount
        setOrderId('BDAO_' + Math.floor(Math.random() * 10000000000));
        
        // Fetch provinces data
        fetch('https://provinces.open-api.vn/api/?depth=3')
            .then(res => res.json())
            .then(data => {
                setProvinces(data);
            })
            .catch(err => console.error(err));
    }, []);

    const handleProvinceChange = (e) => {
        const pCode = e.target.value;
        setSelectedProvince(pCode);
        const p = provinces.find(x => x.code.toString() === pCode);
        setDistricts(p ? p.districts : []);
        setSelectedDistrict('');
        setWards([]);
        setSelectedWard('');
    };

    const handleDistrictChange = (e) => {
        const dCode = e.target.value;
        setSelectedDistrict(dCode);
        const d = districts.find(x => x.code.toString() === dCode);
        setWards(d ? d.wards : []);
        setSelectedWard('');
    };

    // Helpers for summary display
    const provinceName = provinces.find(x => x.code.toString() === selectedProvince)?.name || '';
    const districtName = districts.find(x => x.code.toString() === selectedDistrict)?.name || '';
    const wardName = wards.find(x => x.code.toString() === selectedWard)?.name || '';
    const fullAddress = [addressLine, wardName, districtName, provinceName].filter(Boolean).join(', ');
    const fullNameDisplay = `${gender === 'anh' ? 'Anh' : 'Chị'} ${customerName}`;

    const handlePlaceOrder = async (paymentMethod) => {
        if (!cart || cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }
        
        try {
            const orderPayload = {
                userId: user?.userId ? parseInt(user.userId) : null,
                customerName: fullNameDisplay,
                phone: customerPhone,
                email: customerEmail,
                address: fullAddress,
                totalAmount: cartTotal,
                paymentMethod: paymentMethod,
                items: cart.map(item => ({
                    productId: parseInt(item.id, 10),
                    quantity: item.quantity,
                    unitPrice: parseFloat(item.price)
                }))
            };

            const response = await api.post('/orders', orderPayload);
            if (response.data) {
                clearCart();
                alert(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${response.data.orderId || response.data.orderId}`);
                if (user?.userId) {
                    window.location.href = '/order-history';
                } else {
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            const data = error.response?.data || {};
            const errorMessage = data.inner || data.message || data.Message || error.message;
            alert(`Có lỗi xảy ra khi đặt hàng: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                backgroundColor: '#f4f8fa',
                width: '100%',
                maxWidth: '900px',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                {/* Header Steps */}
                <div style={{
                    backgroundColor: '#00709e',
                    color: 'white',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <button 
                        onClick={onClose}
                        style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: currentStep === 1 ? 1 : 0.6 }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: currentStep === 1 ? 'rgba(255,255,255,0.2)' : 'transparent', border: currentStep === 1 ? 'none' : '1px solid rgba(255,255,255,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                <User size={18} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: currentStep === 1 ? 600 : 400 }}>Điền thông tin</span>
                        </div>
                        <div style={{ width: '60px', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: currentStep === 2 ? 1 : 0.6 }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: currentStep === 2 ? 'rgba(255,255,255,0.2)' : 'transparent', border: currentStep === 2 ? 'none' : '1px solid rgba(255,255,255,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                <ShoppingBag size={18} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: currentStep === 2 ? 600 : 400 }}>Chọn phương thức</span>
                        </div>
                        <div style={{ width: '60px', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: currentStep === 3 ? 1 : 0.6 }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: currentStep === 3 ? 'rgba(255,255,255,0.2)' : 'transparent', border: currentStep === 3 ? 'none' : '1px solid rgba(255,255,255,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                <CreditCard size={18} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: currentStep === 3 ? 600 : 400 }}>Thanh toán</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Cart Items Summary */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            {cart.map(item => {
                                let parsedAttr = {};
                                try { if (item.attributes) parsedAttr = JSON.parse(item.attributes); } catch(e) {}
                                const resolvedImage = parsedAttr?.thumbnailUrl || parsedAttr?.imageUrl || item.imageUrl;
                                const imgUrl = resolvedImage ? (resolvedImage.startsWith('http') ? resolvedImage : `${backendUrl}${resolvedImage}`) : 'https://via.placeholder.com/60';
                                
                                return (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ width: '60px', height: '60px', marginRight: '1rem' }}>
                                        <img src={imgUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div style={{ flex: 1, fontSize: '0.9rem', color: '#374151', paddingRight: '1rem' }}>
                                        {item.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '2rem' }}>
                                        <div style={{ padding: '0.2rem 0.5rem', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '0.85rem', color: '#9ca3af' }}>-</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.quantity}</div>
                                        <div style={{ padding: '0.2rem 0.5rem', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '0.85rem', color: '#9ca3af' }}>+</div>
                                    </div>
                                    <div style={{ fontWeight: 600, color: '#374151' }}>
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                    </div>
                                </div>
                            )})}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                <span style={{ fontSize: '0.95rem', color: '#4b5563' }}>Giá trị đơn hàng:</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e30019' }}>{cartTotal.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>

                        {currentStep === 1 && (
                            <>
                                {/* Thông tin khách hàng */}
                                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>Thông tin khách hàng</h3>
                                    
                                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                                            <input type="radio" name="gender" checked={gender === 'anh'} onChange={() => setGender('anh')} /> Anh
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                                            <input type="radio" name="gender" checked={gender === 'chi'} onChange={() => setGender('chi')} /> Chị
                                        </label>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem' }}>Họ và tên <span style={{color: 'red'}}>*</span></div>
                                            <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nguyễn Văn A" style={{ width: '100%', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem' }}>Số điện thoại <span style={{color: 'red'}}>*</span></div>
                                            <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="0123456789" style={{ width: '100%', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem' }} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem' }}>Email <span style={{color: 'red'}}>*</span></div>
                                        <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="abc@gmail.com" style={{ width: '100%', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem' }} />
                                    </div>

                                    <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: '4px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#0369a1' }}>
                                        <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>ℹ️</span>
                                        <span>Thông tin đơn hàng sẽ được gửi qua email. Nhà cung cấp sẽ liên hệ với bạn qua số điện thoại.</span>
                                    </div>
                                </div>

                                {/* Yêu cầu nhận hàng */}
                                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>Yêu cầu nhận hàng</h3>
                                    
                                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                                            <input type="radio" name="delivery" checked={deliveryType === 'home'} onChange={() => setDeliveryType('home')} /> Giao hàng tại nhà
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                                            <input type="radio" name="delivery" checked={deliveryType === 'store'} onChange={() => setDeliveryType('store')} /> Nhận tại cửa hàng
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem' }}>Địa chỉ cụ thể <span style={{color: 'red'}}>*</span></div>
                                            <input type="text" value={addressLine} onChange={e => setAddressLine(e.target.value)} placeholder="Số nhà, ngõ, đường..." style={{ width: '100%', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem' }}>Tỉnh/Thành phố <span style={{color: 'red'}}>*</span></div>
                                            <select value={selectedProvince} onChange={handleProvinceChange} style={{ width: '100%', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem', color: selectedProvince ? '#374151' : '#9ca3af', backgroundColor: 'transparent' }}>
                                                <option value="">Chọn Tỉnh/ Thành phố</option>
                                                {provinces.map(p => (
                                                    <option key={p.code} value={p.code}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem' }}>Quận/Huyện <span style={{color: 'red'}}>*</span></div>
                                            <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince} style={{ width: '100%', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem', color: selectedDistrict ? '#374151' : '#9ca3af', backgroundColor: 'transparent' }}>
                                                <option value="">Chọn Quận/ Huyện</option>
                                                {districts.map(d => (
                                                    <option key={d.code} value={d.code}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem' }}>Phường/Xã <span style={{color: 'red'}}>*</span></div>
                                            <select value={selectedWard} onChange={e => setSelectedWard(e.target.value)} disabled={!selectedDistrict} style={{ width: '100%', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem', color: selectedWard ? '#374151' : '#9ca3af', backgroundColor: 'transparent' }}>
                                                <option value="">Chọn Phường/ Xã</option>
                                                {wards.map(w => (
                                                    <option key={w.code} value={w.code}>{w.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.5rem' }}>Ghi chú cho người bán</div>
                                        <input type="text" placeholder="Ghi chú cho người bán" style={{ width: '100%', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                    <button 
                                        onClick={() => setCurrentStep(2)}
                                        style={{ 
                                            backgroundColor: '#00709e', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '4px', 
                                            padding: '0.8rem 4rem', 
                                            fontSize: '1rem', 
                                            fontWeight: 600, 
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </>
                        )}
                        {currentStep === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button 
                                    onClick={() => setCurrentStep(1)} 
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', alignSelf: 'flex-start', padding: 0 }}
                                >
                                    <ArrowLeft size={18} />
                                    <span style={{ fontSize: '0.95rem' }}>Quay lại</span>
                                </button>

                                <div style={{ border: '1px dashed #d1d5db', borderRadius: '4px', padding: '1.5rem', backgroundColor: 'white', fontSize: '0.9rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div>Mã đơn hàng: <span style={{ fontWeight: 600 }}>{orderId}</span></div>
                                    <div>Người nhận hàng: <span style={{ fontWeight: 600 }}>{fullNameDisplay}, {customerPhone}</span></div>
                                    <div>Địa chỉ nhận hàng: <span style={{ fontWeight: 600 }}>{fullAddress}</span></div>
                                </div>

                                <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 600, color: '#374151', margin: '0.5rem 0' }}>Chọn hình thức thanh toán</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {/* Payment Method 1 */}
                                    <button onClick={() => handlePlaceOrder('VietQR')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ color: '#e30019' }}><QrCode size={32} /></div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#374151', fontSize: '1rem', marginBottom: '0.2rem' }}>Quét mã chuyển khoản VietQR</div>
                                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Ghi nhận giao dịch tức thì. QR được chấp nhận bởi 40+ Ngân hàng và 4 Ví điện tử.</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>baokim</div>
                                    </button>

                                    {/* Payment Method 2 */}
                                    <button onClick={() => handlePlaceOrder('ATM')} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                                        <div style={{ color: '#00709e' }}><CardIcon size={28} /></div>
                                        <div style={{ fontWeight: 600, color: '#374151', fontSize: '1rem' }}>Thẻ ATM</div>
                                    </button>

                                    {/* Payment Method 3 */}
                                    <button onClick={() => handlePlaceOrder('Visa/MasterCard')} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                                        <div style={{ color: '#1e3a8a' }}><CardIcon size={28} /></div>
                                        <div style={{ fontWeight: 600, color: '#374151', fontSize: '1rem' }}>Thẻ Visa, MasterCard, JCB</div>
                                    </button>

                                    {/* Payment Method 4 */}
                                    <button onClick={() => handlePlaceOrder('COD')} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                                        <div style={{ color: '#e30019' }}><Banknote size={28} /></div>
                                        <div style={{ fontWeight: 600, color: '#374151', fontSize: '1rem' }}>Thanh toán khi nhận hàng (COD)</div>
                                    </button>

                                    {/* Payment Method 5 */}
                                    <button onClick={() => handlePlaceOrder('Bank Transfer')} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                                        <div style={{ color: '#00709e' }}><Building2 size={28} /></div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#374151', fontSize: '1rem', marginBottom: '0.2rem' }}>Tài khoản ngân hàng</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Chấp nhận bởi MB Bank, VIB Bank, SCB Bank, SHINHAN Bank, PVcom Bank, BV Bank</div>
                                        </div>
                                    </button>

                                    {/* Payment Method 6 */}
                                    <button onClick={() => handlePlaceOrder('VNPAY')} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                                        <div style={{ color: '#e30019' }}><QrCode size={28} /></div>
                                        <div style={{ fontWeight: 600, color: '#374151', fontSize: '1rem' }}>VNPAY QR</div>
                                    </button>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>

                {/* Footer */}
                <div style={{ 
                    padding: '1rem 2rem', 
                    borderTop: '1px solid #e5e7eb', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: '#f4f8fa',
                    fontSize: '0.85rem',
                    color: '#6b7280'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/terms-of-use" style={{ color: '#6b7280', textDecoration: 'none' }}>Điều khoản sử dụng</Link>
                        <Link to="/faq" style={{ color: '#6b7280', textDecoration: 'none' }}>Câu hỏi thường gặp</Link>
                        <Link to="/privacy-policy" style={{ color: '#6b7280', textDecoration: 'none' }}>Chính sách bảo mật</Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                            <ShieldCheck size={18} color="#059669" />
                            <span style={{ fontWeight: 700, color: '#059669' }}>PCI DSS</span>
                            <span style={{ fontWeight: 600, color: '#0284c7', marginLeft: '0.5rem' }}>secure</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <span style={{ color: '#059669', fontWeight: 800, fontSize: '1.2rem' }}>✓</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700, textAlign: 'center', marginTop: '2px' }}>baokim</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutModal;
