import React from 'react';

const BankAccount = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111827' }}>Tài khoản ngân hàng</h1>
            
            <p style={{ fontSize: '0.95rem', color: '#dc2626', marginBottom: '1.5rem', textAlign: 'center' }}>
                Quý khách chuyển khoản nội dung: <strong>Họ tên + Số điện thoại</strong> theo thông tin tài khoản bên dưới, chúng tôi sẽ gọi điện xác nhận và giao hàng cho quý khách.
            </p>

            <div style={{ marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.8' }}>
                <div style={{ color: '#dc2626', fontWeight: 600 }}>STK : 2122379029</div>
                <div style={{ color: '#dc2626', fontWeight: 600 }}>Ngân hàng: BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam</div>
                <div style={{ color: '#dc2626', fontWeight: 600 }}>Tên: NGUYEN SINH HOANG</div>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#0ea5e9', color: '#fff', textAlign: 'center', padding: '1rem', fontWeight: 600, fontSize: '1.1rem' }}>
                    TGTT KHTN SO CHON (TC) VND
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                    <img 
                        src="https://img.vietqr.io/image/bidv-2122379029-compact2.jpg?amount=0&accountName=NGUYEN%20SINH%20HOANG" 
                        alt="QR Code Ngân Hàng" 
                        style={{ width: '300px', height: '300px', objectFit: 'contain', marginBottom: '1.5rem' }} 
                    />
                    
                    <table style={{ width: '100%', maxWidth: '400px', fontSize: '0.95rem', color: '#374151', marginTop: '1rem' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6b7280' }}>Số tài khoản</td>
                                <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>2122379029</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6b7280' }}>Tên chủ tài khoản</td>
                                <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600, textTransform: 'uppercase' }}>NGUYEN SINH HOANG</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0.5rem 0', color: '#6b7280' }}>Tên ngân hàng</td>
                                <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BankAccount;
