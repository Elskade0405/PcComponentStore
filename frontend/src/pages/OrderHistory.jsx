import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, Truck } from 'lucide-react';
import api from '../services/api';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = API_URL;

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            if (user?.userId) {
                try {
                    const res = await api.get(`/orders/user/${user.userId}`);
                    setOrders(res.data);
                } catch (error) {
                    console.error("Failed to fetch user orders:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading, navigate]);

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

    if (authLoading || loading) {
        return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải thông tin...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Package size={28} color="#e30019" />
                    Lịch sử mua hàng
                </h1>

                {orders.length === 0 ? (
                    <div style={{ backgroundColor: 'white', padding: '4rem 2rem', textAlign: 'center', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Package size={40} color="#9ca3af" />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Chưa có đơn hàng nào</h2>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Bạn chưa thực hiện giao dịch nào trên hệ thống.</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Tiếp tục mua sắm</button>
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#4b5563', fontSize: '0.9rem' }}>Mã đơn hàng</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#4b5563', fontSize: '0.9rem' }}>Ngày đặt</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#4b5563', fontSize: '0.9rem' }}>Trạng thái</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#4b5563', fontSize: '0.9rem' }}>Tổng tiền</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#4b5563', fontSize: '0.9rem', textAlign: 'right' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, idx) => {
                                    const statusStyle = getStatusStyle(order.status);
                                    return (
                                        <tr key={order.id} style={{ borderBottom: idx !== orders.length - 1 ? '1px solid #e5e7eb' : 'none', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f9fafb' } }}>
                                            <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>#{order.id}</td>
                                            <td style={{ padding: '1rem 1.5rem', color: '#4b5563', fontSize: '0.95rem' }}>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '0.4rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    {statusStyle.icon}
                                                    {getStatusLabel(order.status)}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#e30019', fontSize: '1rem' }}>{order.totalAmount.toLocaleString('vi-VN')} đ</td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => navigate(`/order-history/${order.id}`)}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                                >
                                                    Chi tiết <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
