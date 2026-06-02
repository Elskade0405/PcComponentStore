import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>Chính sách bảo mật</h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                    PC Component Store cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi hiểu rằng thông tin của bạn là tài sản cá nhân và cần được bảo vệ ở mức cao nhất.
                </p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>1. Mục đích thu thập thông tin</h3>
                <p style={{ lineHeight: 1.8, color: '#4b5563', marginBottom: '1rem' }}>
                    Chúng tôi thu thập thông tin của bạn để xử lý đơn hàng, cung cấp dịch vụ hậu mãi, và gửi các thông báo về khuyến mãi (nếu bạn đồng ý).
                </p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>2. Phạm vi sử dụng thông tin</h3>
                <p style={{ lineHeight: 1.8, color: '#4b5563', marginBottom: '1rem' }}>
                    Thông tin cá nhân thu thập được sẽ chỉ được sử dụng trong nội bộ công ty. Chúng tôi không chia sẻ thông tin của bạn cho bất kỳ bên thứ ba nào ngoại trừ đối tác vận chuyển.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
