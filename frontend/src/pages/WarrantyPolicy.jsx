import React from 'react';

const WarrantyPolicy = () => {
    return (
        <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: '#333', lineHeight: '1.6' }}>
            <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>Quy định bảo hành</h1>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Chính sách bảo hành chung</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #e5e7eb', padding: '1rem', backgroundColor: '#f9fafb', textAlign: 'left', width: '50%' }}>DANH MỤC SẢN PHẨM</th>
                        <th style={{ border: '1px solid #e5e7eb', padding: '1rem', backgroundColor: '#f9fafb', textAlign: 'left', width: '50%' }}>PHƯƠNG ÁN XỬ LÝ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #e5e7eb', padding: '1rem', fontWeight: 600 }}>CPU - SSD - RAM - NGUỒN</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '1rem', fontWeight: 600 }}>ĐỔI MỚI <span style={{ color: '#dc2626' }}>100%</span> TRONG <span style={{ color: '#dc2626' }}>3 NĂM</span> ĐẦU SỬ DỤNG</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #e5e7eb', padding: '1rem', fontWeight: 600 }}>MAINBOARD - HDD- VGA</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '1rem', fontWeight: 600 }}>ĐỔI MỚI <span style={{ color: '#dc2626' }}>100%</span> TRONG <span style={{ color: '#dc2626' }}>6 THÁNG</span> ĐẦU SỬ DỤNG</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #e5e7eb', padding: '1rem', fontWeight: 600 }}>MÀN HÌNH - THIẾT BỊ MẠNG- GEAR - PHỤ KIỆN</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '1rem', fontWeight: 600 }}>ĐỔI MỚI <span style={{ color: '#dc2626' }}>100%</span> TRONG <span style={{ color: '#dc2626' }}>1 THÁNG</span> ĐẦU SỬ DỤNG</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '0.5rem' }}>LƯU Ý : MÀN HÌNH - GEAR CẦN GIỮ VỎ HỘP ĐẦY ĐỦ PHỤ KIỆN . NGOẠI HÌNH KHÔNG BỊ VA ĐẬP , XƯỚC DĂM.</p>
                <p style={{ color: '#dc2626', fontWeight: 600 }}>" Đổi trả sản phẩm chỉ áp dụng với những sản phẩm bị lỗi do hãng sản xuất và còn đủ điều kiện bảo hành. "</p>
            </div>

            <p style={{ marginBottom: '2rem' }}>
                Trong thời gian sử dụng nếu gặp bất kỳ trục trặc, lỗi sản phẩm nào. Khách hàng mang trực tiếp sản phẩm đến trung tâm bảo hành của hãng.
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Điều kiện bảo hành hợp lệ:</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Sản phẩm còn nguyên vẹn, không bị nứt vỡ, không bị biến dạng do tác động của ngoại lực.</li>
                <li>Sản phẩm không có dấu hiệu bị ẩm, vô nước dẫn đến gây chạm mạch.</li>
                <li>Sản phẩm phải còn nguyên vẹn thông tin S/N và tem của nhà phân phối còn nguyên vẹn với đầy đủ thông tin thời gian bảo hành.</li>
                <li>Sản phẩm phải còn trong thời gian bảo hành.</li>
            </ul>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Điều kiện từ chối bảo hành</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Sản phẩm bị hư do thiên tai, hỏa hoạn, lụt lội, sét đánh, côn trùng, động vật vào.</li>
                <li>Sản phẩm được đặt nơi bụi bẩn, ẩm ướt, bị vào nước, bị thấm nước.</li>
                <li>Sản phẩm bị biến dạng do tác động nhiệt, tác động bên ngoài.</li>
                <li>Sản phẩm có vết mốc, rỉ sét hoặc bị ăn mòn, oxy hóa bởi hóa chất.</li>
                <li>Sản phẩm bị hư do dùng sai điện thế và dòng điện chỉ định.</li>
                <li>Khách hàng gây nên những khuyết tật như biến dạng, nứt vỡ, trầy xước.</li>
                <li>Sản phẩm hết hạn bảo hành.</li>
            </ul>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Thời gian xử lý bảo hành</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Thời gian bảo hành trung bình là 7 ngày làm việc ( không tính chủ nhật & ngày lễ ). Sản phẩm bảo hành xong sớm hơn sẽ có thông báo cho khách hàng.</li>
                <li>Nếu sản phẩm bảo hành không còn hàng , không thể thay thế , sửa chữa thì <strong>HGEARS</strong> sẽ đổi trả sang sản phẩm tương đương hoặc nhập lại theo giá thỏa thuận.</li>
                <li>Trong thời gian bảo hành nếu khách hàng có nhu cầu mượn sản phẩm để sử dụng <strong>HGEARS</strong> sẽ đáp ứng cho quý khách hàng ( nếu có ).</li>
                <li style={{ color: '#dc2626', fontWeight: 600, listStyleType: 'none', marginLeft: '-2rem', marginTop: '0.5rem' }}>LƯU Ý : HGEARS KHÔNG CHỊU TRÁCH NHIỆM VỀ DỮ LIỆU VÀ PHẦN MỀM CỦA QUÝ KHÁCH HÀNG</li>
            </ul>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>4. Địa chỉ tiếp nhận bảo hành</h3>
            <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: 600, color: '#dc2626', marginBottom: '0.5rem' }}>* SHOWROOM HÀ NỘI : 123 Ha noi</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', fontWeight: 600 }}>
                    <li>SĐT : <span style={{ color: '#dc2626' }}>Mr.Sinh 0362736488</span></li>
                </ul>
            </div>
        </div>
    );
};

export default WarrantyPolicy;
