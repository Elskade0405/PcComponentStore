import React from 'react';
import { Gift } from 'lucide-react';

const PromotionInfo = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Gift size={36} color="#ef4444" /> Chi tiết Ưu đãi Build PC
            </h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem', marginBottom: '2rem' }}>
                    Để tri ân khách hàng đã tin tưởng chọn mua trọn bộ PC tại cửa hàng, chúng tôi xin gửi đến quý khách chương trình ưu đãi đặc biệt:
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.5rem' }}>Giảm ngay 500,000đ</h4>
                        <p style={{ color: '#7f1d1d', margin: 0 }}>Áp dụng cho cấu hình PC từ 15.000.000đ trở lên.</p>
                    </div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.5rem' }}>Giảm ngay 1,500,000đ</h4>
                        <p style={{ color: '#7f1d1d', margin: 0 }}>Áp dụng cho cấu hình PC từ 30.000.000đ trở lên.</p>
                    </div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.5rem' }}>Quà tặng kèm theo</h4>
                        <p style={{ color: '#7f1d1d', margin: 0 }}>Tặng Bàn phím cơ hoặc Chuột Gaming trị giá đến 800,000đ tùy theo cấu hình.</p>
                    </div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.5rem' }}>Dịch vụ Miễn phí</h4>
                        <p style={{ color: '#7f1d1d', margin: 0 }}>Miễn phí cài đặt Windows, Office, Game cơ bản và giao hàng tận nơi (15km).</p>
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <p style={{ fontStyle: 'italic', color: '#6b7280', fontSize: '0.9rem' }}>* Lưu ý: Ưu đãi chỉ áp dụng khi build trọn bộ PC (gồm Main, CPU, RAM, Ổ cứng, Nguồn, Vỏ Case). Không áp dụng cộng dồn với các chương trình khuyến mãi khác.</p>
                </div>
            </div>
        </div>
    );
};

export default PromotionInfo;
