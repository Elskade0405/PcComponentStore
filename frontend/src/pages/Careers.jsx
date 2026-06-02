import React from 'react';
import { Briefcase } from 'lucide-react';

const Careers = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Briefcase size={36} color="#2563eb" /> Tuyển dụng
            </h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                    PC Component Store luôn chào đón những tài năng mới gia nhập đội ngũ trẻ trung, năng động và đam mê công nghệ.
                </p>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem 0' }}>Vị trí đang tuyển:</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: 2, color: '#4b5563' }}>
                    <li><strong>Chuyên viên Tư vấn Kỹ thuật (Sales IT):</strong> Số lượng 5 - Yêu cầu đam mê phần cứng, kỹ năng giao tiếp tốt.</li>
                    <li><strong>Nhân viên Lắp ráp & Cài đặt PC (Kỹ thuật viên):</strong> Số lượng 3 - Ưu tiên ứng viên có kinh nghiệm build PC, tản nhiệt nước custom.</li>
                    <li><strong>Chuyên viên Marketing & Content Creator:</strong> Số lượng 2 - Phụ trách nội dung review sản phẩm, quản trị Fanpage/Tiktok.</li>
                </ul>

                <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.5rem' }}>Cách thức ứng tuyển</h4>
                    <p style={{ color: '#1e3a8a', margin: 0 }}>
                        Vui lòng gửi CV chi tiết kèm portfolio (nếu có) về địa chỉ email: <strong>hr@pccomponentstore.vn</strong> với tiêu đề: <code>[Vị Trí Ứng Tuyển] - [Họ và Tên]</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Careers;
