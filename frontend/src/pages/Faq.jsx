import React from 'react';

const Faq = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>Câu hỏi thường gặp (FAQ)</h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>1. Làm thế nào để kiểm tra tình trạng bảo hành?</h3>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>Bạn có thể mang sản phẩm ra trực tiếp cửa hàng hoặc gửi mã seri qua Zalo/Fanpage để nhân viên kiểm tra thời hạn bảo hành trên hệ thống.</p>
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>2. Cửa hàng có hỗ trợ lắp ráp máy tại nhà không?</h3>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>Có, đối với đơn hàng Build PC trọn bộ từ 20 triệu trở lên trong bán kính 15km, chúng tôi sẽ cử kỹ thuật viên đến tận nơi lắp ráp và cài đặt miễn phí.</p>
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>3. Tôi có thể mua trả góp không?</h3>
                    <p style={{ color: '#4b5563', lineHeight: 1.8 }}>Chúng tôi hỗ trợ trả góp qua thẻ tín dụng (0% lãi suất) và qua công ty tài chính (HD Saison, Home Credit) với thủ tục đơn giản chỉ cần CCCD.</p>
                </div>
            </div>
        </div>
    );
};

export default Faq;
