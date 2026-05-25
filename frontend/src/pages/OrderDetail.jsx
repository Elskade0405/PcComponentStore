import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle2, XCircle, Truck, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import API_URL from '../config';

const OrderDetail = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const backendUrl = API_URL;

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user, authLoading, navigate]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return { bg: '#fef3c7', text: '#d97706', icon: <Clock size={16} /> }; // Amber
            case 'Processing': return { bg: '#e0f2fe', text: '#0284c7', icon: <Package size={16} /> }; // Blue
            case 'Shipped': return { bg: '#ecfdf5', text: '#059669', icon: <Truck size={16} /> }; // Emerald
            case 'Delivered': return { bg: '#dcfce7', text: '#16a34a', icon: <CheckCircle2 size={16} /> }; // Green
            case 'Cancelled': return { bg: '#fef2f2', text: '#dc2626', icon: <XCircle size={16} /> }; // Red
            default: return { bg: '#f3f4f6', text: '#4b5563', icon: <Package size={16} /> }; // Gray
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Pending': return 'Chờ xử lý';
            case 'Processing': return 'Đang xử lý';
            case 'Shipped': return 'Đang giao hàng';
            case 'Delivered': return 'Đã giao hàng';
            case 'Cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const renderOrderProgress = (status) => {
        const steps = [
            { id: 'Pending', label: 'Chờ xử lý', icon: Clock },
            { id: 'Processing', label: 'Đang xử lý', icon: Package },
            { id: 'Shipped', label: 'Đang giao hàng', icon: Truck },
            { id: 'Delivered', label: 'Đã giao', icon: CheckCircle2 }
        ];

        if (status === 'Cancelled') {
            return (
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <XCircle size={18} />
                    <span style={{ fontWeight: 600 }}>Đơn hàng đã bị hủy</span>
                </div>
            );
        }

        const currentIndex = steps.findIndex(s => s.id === status);
        const activeIndex = currentIndex >= 0 ? currentIndex : 0;

        return (
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    {/* Background line */}
                    <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '3px', backgroundColor: '#e5e7eb', zIndex: 1 }}></div>
                    {/* Active line */}
                    <div style={{ position: 'absolute', top: '16px', left: '10%', width: `${(activeIndex / (steps.length - 1)) * 80}%`, height: '3px', backgroundColor: '#059669', zIndex: 2, transition: 'width 0.3s ease' }}></div>
                    
                    {steps.map((step, idx) => {
                        const isActive = idx <= activeIndex;
                        const StepIcon = step.icon;
                        return (
                            <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '25%' }}>
                                <div style={{ 
                                    width: '34px', height: '34px', 
                                    borderRadius: '50%', 
                                    backgroundColor: isActive ? '#059669' : '#f3f4f6',
                                    border: `3px solid ${isActive ? '#dcfce7' : 'white'}`,
                                    color: isActive ? 'white' : '#9ca3af',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.5rem',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <StepIcon size={16} />
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#059669' : '#6b7280', textAlign: 'center' }}>
                                    {step.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (authLoading || loading) {
        return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải thông tin...</div>;
    }

    if (!order) {
        return <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <h2>Không tìm thấy đơn hàng</h2>
            <button onClick={() => navigate('/order-history')} className="btn btn-outline">Quay lại danh sách</button>
        </div>;
    }

    const statusStyle = getStatusStyle(order.status);
    // Support both API formats (raw Entity vs mapped DTO)
    const itemsList = order.orderItems || order.items || [];

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <button 
                    onClick={() => navigate('/order-history')}
                    style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 500 }}
                >
                    <ArrowLeft size={18} /> Quay lại danh sách
                </button>

                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    {/* Order Header */}
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.2rem' }}>Mã đơn hàng</div>
                                <div style={{ fontWeight: 600, color: '#1f2937' }}>#{order.id}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.2rem' }}>Ngày đặt</div>
                                <div style={{ fontWeight: 600, color: '#1f2937' }}>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
                            {statusStyle.icon}
                            {getStatusLabel(order.status)}
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>Thông tin giao hàng</h3>
                        <div style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.5' }}>
                            <p><strong>Người nhận:</strong> {order.customerName}</p>
                            <p><strong>Điện thoại:</strong> {order.phone}</p>
                            <p><strong>Địa chỉ:</strong> {order.address}</p>
                            <p><strong>Phương thức TT:</strong> {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}</p>
                        </div>
                    </div>
                    
                    {/* Order Progress Tracker */}
                    {renderOrderProgress(order.status)}

                    {/* Order Items */}
                    <div style={{ padding: '0 1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', margin: '1.5rem 0 0.5rem' }}>Chi tiết mặt hàng</h3>
                        {itemsList.map((item, idx) => {
                            // Extract properties gracefully to support both DTO and raw Entity
                            const productName = item.name || (item.product && item.product.cpuName) || 'Sản phẩm';
                            const rawImage = item.image || (item.product && item.product.attributes);
                            const unitPrice = item.unitPrice || 0;
                            const quantity = item.quantity || 1;

                            let parsedAttr = {};
                            try { if (rawImage) parsedAttr = JSON.parse(rawImage); } catch(e) {}
                            const resolvedImage = parsedAttr?.thumbnailUrl || parsedAttr?.imageUrl;
                            const imgUrl = resolvedImage ? `${backendUrl}${resolvedImage}` : 'https://via.placeholder.com/60';

                            return (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 0', borderBottom: idx !== itemsList.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <div style={{ width: '80px', height: '80px', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px', marginRight: '1.5rem' }}>
                                        <img src={imgUrl} alt={productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{productName}</h4>
                                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Số lượng: {quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: 600, color: '#e30019', fontSize: '1.1rem' }}>
                                        {(unitPrice * quantity).toLocaleString('vi-VN')} đ
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Footer */}
                    <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#fafafa', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '1rem', color: '#4b5563' }}>Tổng cộng:</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e30019' }}>
                            {order.totalAmount.toLocaleString('vi-VN')} đ
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
