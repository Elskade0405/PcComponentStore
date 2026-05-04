import React from 'react';
import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
    return (
        <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: '#333', lineHeight: '1.8' }}>
            <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>Chính sách vận chuyển và kiểm hàng</h1>
            
            <p style={{ fontWeight: 600, marginBottom: '2rem', textAlign: 'justify' }}>
                Chính sách vận chuyển và giao nhận tại Hgears là một phần của quy chế hoạt động thương mại điện tử của công ty Cổ Phần Hgears Việt Nam, tuân thủ Nghị định 52/2013/NĐ-CP của chính phủ nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam và các quy định của pháp luật có liên quan.
            </p>

            <h2 style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, margin: '2rem 0 1.5rem 0' }}>Chính sách vận chuyển</h2>
            
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Quy trình giao vận, chuyển hàng</h3>
            <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
                Tất cả các đơn hàng được đặt hàng trên website Hgears sẽ được xử lý trong vòng 24 giờ khi bạn đăng ký. Bạn sẽ nhận được cuộc gọi của Tổng đài viên để xác nhận đơn hàng và được tư vấn thêm về sản phẩm.
            </p>
            <p style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
                Sau khi nhận đơn hàng từ người mua và đã xác thực thông tin mua hàng qua điện thoại, chúng tôi sẽ tiến hành giao hàng theo yêu cầu của quý khách hàng. Chúng tôi thực hiện giao hàng đến tận tay khách hàng qua công ty vận chuyển.
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Phạm vi áp dụng</h3>
            <p style={{ marginBottom: '2rem', textAlign: 'justify' }}>
                Chúng tôi thực hiện giao hàng trên 63 tỉnh thành trong cả nước. Bất kỳ lúc nào khách hàng cũng có thể tra cứu, kiểm tra lộ trình hay tình trạng của những đơn hàng đã đặt mua qua các công cụ của đối tác vận chuyển.
            </p>

            <h2 style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, margin: '2rem 0 1.5rem 0' }}>Quy định kiểm hàng</h2>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Giao nhận và kiểm hàng</h3>
            <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
                Khách hàng sẽ nhận được hàng chậm nhất là bảy (07) ngày sau khi hoàn tất đơn hàng của mình. Thời gian luân chuyển và giao hàng nhanh hay chậm tùy theo đơn vị chuyển phát tại địa chỉ mà khách hàng đã cung cấp khi đặt hàng.
            </p>
            <p style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
                Khách hàng sẽ nhận và kiểm tra hàng hóa trước khi thanh toán. Các khiếu nại về sản phẩm, chứng từ sẽ được giải quyết theo <Link to="/warranty-policy" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>quy định bảo hành</Link> và <Link to="#" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>chính sách đổi trả, hoàn tiền</Link>.
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Trách nhiệm với hàng hóa vận chuyển</h3>
            <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
                Việc cung cấp chứng từ hàng hóa sẽ do công ty chúng tôi cung cấp. Công ty sẽ chịu trách nhiệm với hàng hóa và các rủi ro như mất mát hoặc hư hại của hàng hóa trong suốt quá trình vận chuyển hàng từ kho hàng chúng tôi đến quý khách.
            </p>
            <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
                Quý khách có trách nhiệm kiểm tra hàng hóa khi nhận hàng, đề nghị Quý khách quay video khi mở hàng. Khi phát hiện hàng hóa bị hư hại, trầy xước, bể vỡ, móp méo, hoặc sai hàng hóa thì ký xác nhận tình trạng hàng hóa với Nhân viên giao nhận và thông báo ngay cho chúng tôi qua số điện thoại <span style={{ fontWeight: 600, color: '#dc2626' }}>0362 736 488</span>. Chúng tôi chỉ xử lý những đơn hàng hư hại có video quay lại quá trình mở hàng.
            </p>
            <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
                Trong vòng 24 giờ sau khi quý khách ký nhận hàng mà không có ý kiến về hàng hóa, công ty sẽ không chịu trách nhiệm với những yêu cầu đổi trả do hư hỏng, trầy xước, bể vỡ, móp méo, sai hàng hóa,... từ Quý khách sau này (Trừ trường hợp lỗi do nhà sản xuất).
            </p>
            <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
                Nếu dịch vụ vận chuyển do quý khách chỉ định và lựa chọn thì quý khách sẽ chịu trách nhiệm với hàng hóa và các rủi ro như mất mát hoặc hư hại của hàng hóa trong suốt quá trình vận chuyển hàng từ kho hàng của công ty đến quý khách. Khách hàng sẽ chịu trách nhiệm cước phí và tổn thất liên quan.
            </p>
        </div>
    );
};

export default ShippingPolicy;
