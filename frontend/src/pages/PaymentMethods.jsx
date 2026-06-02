import React from 'react';

const PaymentMethods = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>Phương thức thanh toán</h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                    Chúng tôi cung cấp nhiều phương thức thanh toán linh hoạt để quý khách hàng dễ dàng mua sắm:
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>1. Thanh toán khi nhận hàng (COD)</h4>
                        <p style={{ color: '#4b5563', margin: 0 }}>Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng sau khi đã kiểm tra sản phẩm.</p>
                    </div>
                    <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>2. Chuyển khoản ngân hàng</h4>
                        <p style={{ color: '#4b5563', margin: 0 }}>Quý khách chuyển khoản vào STK của công ty. Đơn hàng sẽ được xử lý ngay sau khi hệ thống ghi nhận tiền.</p>
                    </div>
                    <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>3. Thanh toán qua ví điện tử</h4>
                        <p style={{ color: '#4b5563', margin: 0 }}>Hỗ trợ Momo, ZaloPay, VNPay. Quét mã QR thanh toán nhanh chóng, bảo mật.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethods;
