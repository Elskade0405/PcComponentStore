import React from 'react';

const AboutUs = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>Giới thiệu về chúng tôi</h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '1rem' }}>
                    Chào mừng bạn đến với <strong>PC Component Store</strong>, điểm đến tin cậy hàng đầu cho mọi nhu cầu về linh kiện máy tính, laptop và các giải pháp công nghệ tại Việt Nam.
                </p>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '1rem' }}>
                    Được thành lập với sứ mệnh mang lại trải nghiệm mua sắm tuyệt vời cùng các sản phẩm chính hãng 100%, chúng tôi tự hào là đối tác chiến lược của nhiều thương hiệu lớn như Intel, AMD, ASUS, GIGABYTE, MSI, Corsair...
                </p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>Tầm nhìn & Sứ mệnh</h3>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '1rem' }}>
                    Tầm nhìn của chúng tôi là trở thành nhà bán lẻ thiết bị phần cứng số 1 Đông Nam Á, cung cấp không chỉ sản phẩm mà còn là kiến thức, giải pháp giúp khách hàng xây dựng những hệ thống máy tính tối ưu nhất cho công việc và giải trí.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
