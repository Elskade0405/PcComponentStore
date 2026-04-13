import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, Settings } from 'lucide-react'; // Settings as a placeholder for Print/Excel if needed

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const backendUrl = 'http://localhost:5285';

    return (
        <div style={{ backgroundColor: '#f1f1f1', paddingBottom: '4rem', paddingTop: '1rem', minHeight: '80vh' }}>
            <div className="container" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Trang chủ</Link> / 
                <span style={{ color: '#333', marginLeft: '0.4rem', fontWeight: 600 }}>Thông tin giỏ hàng</span>
            </div>

            <div className="container">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2563eb', marginBottom: '1rem', marginTop: 0 }}>Giỏ hàng</h2>

                <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                            Giỏ hàng của bạn đang trống.<br/><br/>
                            <Link to="/" style={{ padding: '0.5rem 1rem', backgroundColor: '#e30019', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 600 }}>Tiếp tục mua sắm</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {cart.map((item, index) => {
                                const imgUrl = item.imageUrl ? `${backendUrl}${item.imageUrl}` : 'https://via.placeholder.com/80?text=SP';
                                return (
                                    <div key={item.id} style={{ 
                                        display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', 
                                        borderBottom: index < cart.length - 1 ? '1px solid #e5e7eb' : 'none' 
                                    }}>
                                        {/* Image */}
                                        <div style={{ width: '80px', height: '80px', flexShrink: 0, marginRight: '1.5rem' }}>
                                            <img src={imgUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>

                                        {/* Name & Warranty */}
                                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                                            <Link to={`/product/${item.id}`} style={{ fontWeight: 700, color: '#333', textDecoration: 'none', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                                                {item.name}
                                            </Link>
                                            <div style={{ fontSize: '0.8rem', color: '#333', fontWeight: 600 }}>
                                                Bảo hành: <span style={{ color: '#e30019' }}>36 tháng</span>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div style={{ width: '140px', fontWeight: 700, fontSize: '0.95rem', color: '#333' }}>
                                            {item.price.toLocaleString('vi-VN')} đ
                                        </div>

                                        {/* Quantity Controls */}
                                        <div style={{ width: '120px', display: 'flex', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '2px', overflow: 'hidden' }}>
                                                <button 
                                                    style={{ padding: '0.2rem 0.4rem', backgroundColor: 'white', border: 'none', cursor: 'pointer', borderRight: '1px solid #d1d5db' }}
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                ><Minus size={14} /></button>
                                                <input 
                                                    type="text" 
                                                    value={item.quantity} 
                                                    readOnly 
                                                    style={{ width: '30px', textAlign: 'center', border: 'none', outline: 'none', fontWeight: 600, fontSize: '0.9rem' }} 
                                                />
                                                <button 
                                                    style={{ padding: '0.2rem 0.4rem', backgroundColor: 'white', border: 'none', cursor: 'pointer', borderLeft: '1px solid #d1d5db' }}
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                ><Plus size={14} /></button>
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <div style={{ width: '140px', fontWeight: 700, fontSize: '0.95rem', color: '#333', textAlign: 'right' }}>
                                            {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                        </div>

                                        {/* Remove Action */}
                                        <div style={{ width: '50px', textAlign: 'right' }}>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <div style={{ backgroundColor: '#fafafa', padding: '1.5rem', textAlign: 'right', borderTop: '1px solid #e5e7eb' }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#333' }}>Tổng tiền: </span>
                                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#e30019' }}>{cartTotal.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                        
                        {/* Buyer Info Form */}
                        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1rem' }}>
                            <div style={{ backgroundColor: '#e5e7eb', padding: '0.75rem 1rem', fontWeight: 700, fontSize: '1.1rem', color: '#333', marginBottom: '1rem' }}>
                                Thông tin người mua
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#333', marginBottom: '1.5rem' }}>
                                Để tiếp tục đặt hàng, quý khách xin vui lòng nhập thông tin bên dưới
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Họ tên*</label>
                                    <input type="text" style={{ padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>SĐT*</label>
                                    <input type="text" style={{ padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email*</label>
                                    <input type="email" style={{ padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Địa chỉ*</label>
                                    <input type="text" style={{ padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Tỉnh/Thành phố*</label>
                                    <select style={{ padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none' }}>
                                        <option>Chọn Tỉnh / Thành phố</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Quận/Huyện*</label>
                                    <select style={{ padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none' }}>
                                        <option>Chọn Quận / Huyện</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '8px' }}>Ghi chú</label>
                                    <textarea rows={3} style={{ padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none', resize: 'vertical' }}></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary & Actions */}
                        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1rem', height: 'fit-content' }}>
                            <div style={{ backgroundColor: '#e5e7eb', padding: '0.75rem 1rem', fontWeight: 700, fontSize: '1.1rem', color: '#333', marginBottom: '1rem' }}>
                                Tổng tiền
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <input 
                                    type="text" 
                                    placeholder="Mã Voucher" 
                                    style={{ flex: 1, padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '2px', outline: 'none' }} 
                                />
                                <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '2px', padding: '0 1rem', fontWeight: 600, cursor: 'pointer' }}>
                                    Chọn Voucher
                                </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                <span>Tổng cộng:</span>
                                <span>{cartTotal.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                <span>Giảm giá Voucher:</span>
                                <span>0 đ</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
                                <span>Thành tiền:</span>
                                <span style={{ color: '#e30019', fontSize: '1.2rem' }}>{cartTotal.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#666', marginBottom: '1.5rem' }}>
                                (Giá đã bao gồm VAT)
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                <input type="checkbox" id="terms" defaultChecked />
                                <label htmlFor="terms">Tôi đã đọc và đồng ý với các Điều kiện giao dịch chung của website</label>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <button style={{ backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span>🖨️ In báo giá</span>
                                </button>
                                <button style={{ backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span>📥 Tải file Excel</span>
                                </button>
                            </div>

                            <button onClick={() => alert('Chức năng đặt hàng đang được hoàn thiện!')} style={{ width: '100%', backgroundColor: '#e30019', color: 'white', border: 'none', borderRadius: '4px', padding: '0.8rem', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
                                ✓ ĐẶT HÀNG
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
