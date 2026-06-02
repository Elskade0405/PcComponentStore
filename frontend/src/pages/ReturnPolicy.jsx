import React from 'react';

const ReturnPolicy = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>Chính sách đổi trả & Hoàn tiền</h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                    Nhằm mang lại trải nghiệm mua sắm tốt nhất, chúng tôi áp dụng chính sách đổi trả 1 đổi 1 trong vòng 7 ngày đầu tiên nếu sản phẩm có lỗi từ nhà sản xuất.
                </p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>1. Điều kiện đổi trả</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: 1.8, color: '#4b5563', marginBottom: '1rem' }}>
                    <li>Sản phẩm còn nguyên vẹn, đầy đủ vỏ hộp, phụ kiện, sách hướng dẫn.</li>
                    <li>Sản phẩm không bị trầy xước, móp méo, rơi vỡ, vào nước hoặc có dấu hiệu can thiệp vật lý.</li>
                    <li>Cần có hóa đơn mua hàng hoặc số điện thoại đặt hàng.</li>
                </ul>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>2. Quy trình hoàn tiền</h3>
                <p style={{ lineHeight: 1.8, color: '#4b5563', marginBottom: '1rem' }}>
                    Nếu sản phẩm lỗi và chúng tôi hết hàng đổi mới, quý khách có thể yêu cầu hoàn tiền. Quá trình hoàn tiền sẽ diễn ra từ 3-7 ngày làm việc tùy thuộc vào phương thức thanh toán ban đầu.
                </p>
            </div>
        </div>
    );
};

export default ReturnPolicy;
