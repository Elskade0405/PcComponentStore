import React from 'react';

const TermsOfUse = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>Điều khoản sử dụng</h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                    Chào mừng quý khách đến với PC Component Store. Bằng việc sử dụng trang web này, quý khách đồng ý với các điều khoản sau đây:
                </p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>1. Trách nhiệm của khách hàng</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '1rem' }}>
                    <li>Cung cấp thông tin chính xác khi đặt hàng để đảm bảo việc giao nhận được thuận lợi.</li>
                    <li>Bảo mật tài khoản cá nhân, không chia sẻ mật khẩu cho người khác.</li>
                    <li>Không sử dụng website vào mục đích vi phạm pháp luật.</li>
                </ul>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>2. Quyền lợi và trách nhiệm của PC Component Store</h3>
                <p style={{ lineHeight: 1.8, color: '#4b5563', marginBottom: '1rem' }}>
                    Chúng tôi có quyền từ chối phục vụ, hủy đơn hàng nếu phát hiện có dấu hiệu gian lận. Đồng thời cam kết cung cấp hàng hóa đúng chất lượng, mẫu mã như mô tả trên website.
                </p>
            </div>
        </div>
    );
};

export default TermsOfUse;
