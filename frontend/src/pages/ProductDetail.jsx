import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import API_URL from '../config';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch main product
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);

                // Fetch similar products (mock by fetching all and slicing)
                const similarRes = await api.get('/products');
                setSimilarProducts(similarRes.data.filter(p => p.id !== parseInt(id)).slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch product detail", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
        setActiveIdx(0);
    }, [id]);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Đang tải thông tin sản phẩm...</div>;
    if (!product) return <div style={{ padding: '4rem', textAlign: 'center' }}>Không tìm thấy sản phẩm!</div>;

    // Parse attributes
    let attributes = {};
    if (product.attributes && typeof product.attributes === 'string') {
        try {
            attributes = JSON.parse(product.attributes);
        } catch (e) { }
    }

    // Mock images since DB doesn't have them yet
    const placeholderImg = "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80"; // CPU placeholder
    
    const backendUrl = API_URL;
    const resolvedThumb = attributes.thumbnailUrl || attributes.imageUrl;
    const mainImg = resolvedThumb ? `${backendUrl}${resolvedThumb}` : placeholderImg;
    const detailList = Array.isArray(attributes.detailImageUrls) ? attributes.detailImageUrls.map(u => `${backendUrl}${u}`) : [];
    
    // Combined list of images
    const allImages = Array.from(new Set([mainImg, ...detailList]));

    // Mapper for friendly labels
    const specLabels = {
        // CPU
        generation: 'Thế hệ',
        generationName: 'Tên thế hệ',
        socket: 'Socket',
        cores: 'Số nhân',
        threads: 'Số luồng',
        baseClock: 'Tốc độ cơ bản',
        boostClock: 'Tốc độ tối đa',
        cache: 'Cache',
        memorySupport: 'Hỗ trợ bộ nhớ',
        memoryChannels: 'Hỗ trợ số kênh bộ nhớ',
        pcieVersion: 'Phiên bản PCI Express',
        pcieLanes: 'Số lane PCI Express',
        tdp: 'TDP',
        cooling: 'Tản nhiệt',
        // VGA
        graphicEngine: 'Engine đồ họa',
        busStandard: 'Chuẩn Bus',
        vram: 'Bộ nhớ (VRAM)',
        engineClock: 'Engine Clock',
        cudaCores: 'Lõi CUDA',
        memoryClock: 'Clock bộ nhớ',
        memoryInterface: 'Giao diện bộ nhớ',
        ports: 'Kết nối',
        dimensions: 'Kích thước',
        recommendedPsu: 'PSU đề nghị',
        powerConnectors: 'Power Connectors',
        directX: 'DirectX',
        // RAM
        ramModel: 'Model',
        ramType: 'Loại RAM',
        capacity: 'Dung lượng RAM',
        busSpeed: 'Tốc độ Bus RAM',
        overclock: 'Overclock',
        rgb: 'Đèn nền',
        voltage: 'Điện Áp',
        casLatency: 'CAS Latency',
        warranty: 'Bảo hành',
        // Monitor
        screenSize: 'Kích thước Màn hình',
        resolution: 'Độ phân giải',
        refreshRate: 'Tần số quét',
        // Mainboard
        mainboardSize: 'Kích Thước Mainboard',
        ramSlots: 'Khe Cắm Ram',
        chipset: 'CHIPSET',
        // Storage
        driveType: 'Loại ổ cứng',
        connection: 'Kết nối',
        storageCapacity: 'Dung lượng',
        readSpeed: 'Tốc độ đọc',
        writeSpeed: 'Tốc độ ghi',
        osSupport: 'Hỗ trợ hệ điều hành',
        operatingTemp: 'Nhiệt độ hoạt động',
        otherFeatures: 'Tính năng khác',
        // PC
        pcCpu: 'Vi xử lý',
        pcMainboard: 'Bo mạch chủ',
        pcRam: 'RAM',
        pcVga: 'Card đồ họa',
        pcStorage: 'Ổ cứng',
        pcPsu: 'Nguồn',
        pcCase: 'Vỏ Case',
        // PSU
        powerCapacity: 'Công suất',
        efficiency: 'Chuẩn hiệu suất',
        formFactor: 'Kích thước',
        modular: 'Kiểu cáp',
        inputVoltage: 'Nguồn điện',
        psuFanSize: 'Kích thước quạt',
        // Cooling
        coolerType: 'Loại tản nhiệt',
        supportedSockets: 'Hỗ trợ Socket',
        fanSpeed: 'Tốc độ quạt',
        airflow: 'Lưu lượng gió',
        noiseLevel: 'Độ ồn',
        radiatorSize: 'Kích thước Radiator',
        // Common
        type: 'Loại linh kiện',
        category: 'Danh mục'
    };

    return (
        <div style={{ backgroundColor: '#f1f1f1', paddingBottom: '4rem', paddingTop: '1rem' }}>
            {/* Breadcrumb mock */}
            <div className="container" style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
                <span style={{ cursor: 'pointer' }}>Trang chủ</span> &gt;
                <span style={{ cursor: 'pointer', margin: '0 0.5rem' }}>Linh kiện PC</span> &gt;
                <span style={{ color: '#000', margin: '0 0.5rem' }}>{product.name || 'Đang cập nhật tên sản phẩm'}</span>
            </div>

            <div className="container">
                {/* Top Section Layout: Image (Left), Info (Middle), Policy (Right) */}
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', display: 'grid', gridTemplateColumns: 'minmax(350px, 400px) 1fr 300px', gap: '1.5rem', marginBottom: '1.5rem' }}>

                    {/* 1. Left: Images */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                            <img src={allImages[activeIdx] || mainImg} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                            {allImages.map((img, idx) => (
                                <div key={idx} onClick={() => setActiveIdx(idx)} style={{
                                    width: '70px', height: '70px', border: idx === activeIdx ? '2px solid #ee1b24' : '1px solid #eee',
                                    borderRadius: '4px', padding: '4px', cursor: 'pointer', flexShrink: 0
                                }}>
                                    <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Middle: Info & Buy */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#333', lineHeight: 1.4 }}>
                            {product.name || 'Đang cập nhật tên sản phẩm'}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                            <span>Mã SP: <b>{product.id.toString().padStart(6, '0')}</b></span>
                            <span style={{ borderLeft: '1px solid #ccc', paddingLeft: '1rem' }}>Đánh giá:
                                <span style={{ color: '#f59e0b', marginLeft: '4px' }}>★★★★★</span>
                            </span>
                            <span style={{ borderLeft: '1px solid #ccc', paddingLeft: '1rem' }}>Thương hiệu: <b style={{ color: '#0056b3' }}>{product.brand}</b></span>
                        </div>

                        {/* Price Block TTG style (Red Text, Gray Background or bold red) */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '4px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#e30019' }}>{product.price?.toLocaleString('vi-VN')} đ</span>
                            {attributes.originalPrice && attributes.originalPrice > product.price && (
                                <span style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>{attributes.originalPrice.toLocaleString('vi-VN')} đ</span>
                            )}
                        </div>

                        {/* Short Specs Bullet Points */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#333', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li><b>Tình trạng:</b> {product.stockQuantity > 0 ? <span style={{ color: '#28a745', fontWeight: 'bold' }}>Còn hàng</span> : <span style={{ color: 'red' }}>Hết hàng</span>}</li>
                                <li><b>Bảo hành:</b> 36 Tháng chính hãng</li>
                                {attributes.socket && <li><b>Socket:</b> {attributes.socket}</li>}
                                {attributes.cores && <li><b>Số nhân/luồng:</b> {attributes.cores} {attributes.threads ? `/ ${attributes.threads}` : ''}</li>}
                            </ul>
                        </div>

                        {/* TTG Shop Fake Promotion Box */}
                        <div style={{ border: '1px solid #fed7d7', borderRadius: '4px', marginBottom: '1.5rem', position: 'relative' }}>
                            <div style={{ backgroundColor: '#fff5f5', color: '#c53030', padding: '0.5rem 1rem', fontWeight: 600, borderBottom: '1px solid #fed7d7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🎁 Khuyến mãi / Ưu đãi
                            </div>
                            <div style={{ padding: '1rem', fontSize: '0.9rem', color: '#333' }}>
                                <div style={{ marginBottom: '0.5rem' }}>✔️ Giảm thêm <b>500,000đ</b> khi build kèm PC Fan cứng</div>
                                <div>✔️ Hỗ trợ trả góp 0% qua thẻ tín dụng</div>
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                            <button
                                onClick={() => {
                                    addToCart(product, quantity);
                                    navigate('/cart');
                                }}
                                style={{
                                    flex: 2, backgroundColor: '#e30019', color: 'white', border: 'none', borderRadius: '4px',
                                    padding: '0.8rem', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <span>MUA NGAY</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 400, textTransform: 'none' }}>Giao hàng miễn phí tận nơi</span>
                            </button>
                            <button
                                onClick={() => {
                                    addToCart(product, quantity);
                                    alert('Đã thêm vào giỏ hàng!');
                                }}
                                style={{
                                    width: '60px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', cursor: 'pointer'
                                }}
                            >
                                <ShoppingCart size={24} />
                            </button>
                        </div>
                    </div>

                    {/* 3. Right: Policy Box (Mua hàng tại TTG SHOP style) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1rem', backgroundColor: '#fff' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', textTransform: 'uppercase', color: '#333' }}>Mua hàng tại cửa hàng</h3>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ color: '#e30019', marginTop: '2px' }}>🚚</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>GIAO HÀNG TOÀN QUỐC</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Giao hàng trước, trả tiền sau COD</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ color: '#e30019', marginTop: '2px' }}>🔄</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>ĐỔI TRẢ DỄ DÀNG</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Đổi mới trong 30 ngày đầu</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ color: '#e30019', marginTop: '2px' }}>💳</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>THANH TOÁN TIỆN LỢI</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Tiền mặt, CK, trả góp 0%</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ color: '#e30019', marginTop: '2px' }}>☎️</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>HỖ TRỢ NHIỆT TÌNH</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Tư vấn tổng đài miễn phí 24/7</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Box */}
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '1rem', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Hotline tư vấn online</div>
                            <div style={{ color: '#e30019', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>6767 6767</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Zalo báo giá dự án: 098x xxx xxx</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>

                    {/* Left: Product Description (Mô tả sản phẩm) */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ borderBottom: '2px solid #e30019', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', margin: 0, color: '#333', display: 'inline-block' }}>
                                MÔ TẢ SẢN PHẨM
                            </h2>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#0056b3' }}>Đánh giá {product.name || 'sản phẩm này'}</h3>
                        <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.6, marginBottom: '1rem' }}>
                            Sản phẩm <b>{product.name || 'này'}</b> mang lại hiệu năng tối đa cho người dùng nhờ áp dụng công nghệ {attributes.cores || 'lõi kiến trúc'} hoàn toàn mới, đồng thời cũng duy trì mức nhiệt độ ổn định khi được tích hợp khả năng tối ưu điện năng.
                        </p>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1000&q=80" alt="Tech" style={{ maxWidth: '100%', borderRadius: '4px' }} />
                        </div>

                        <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.6, marginBottom: '1rem' }}>
                            Bo mạch điều khiển thông minh kết hợp băng thông rộng giúp việc xuất hình ảnh ra nhiều màn hình với độ phân giải cao trở nên nhanh chóng và mượt mà hơn bao giờ hết. Đây là lựa chọn hoàn hảo cho game thủ và dân thiết kế đồ họa.
                        </p>
                    </div>

                    {/* Right: Tech Specs (Thông số kỹ thuật) */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                        <div style={{ borderBottom: '2px solid #e30019', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', margin: 0, color: '#333', display: 'inline-block' }}>
                                THÔNG SỐ KỸ THUẬT
                            </h2>
                        </div>

                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem' }}>
                                <div style={{ flex: '1', backgroundColor: '#f9f9f9', padding: '0.75rem', fontWeight: 600, borderRight: '1px solid #e5e7eb' }}>Sản phẩm</div>
                                <div style={{ flex: '2', padding: '0.75rem', color: '#333' }}>{product.categoryName || 'Linh kiện PC'}</div>
                            </div>
                            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem' }}>
                                <div style={{ flex: '1', backgroundColor: '#f9f9f9', padding: '0.75rem', fontWeight: 600, borderRight: '1px solid #e5e7eb' }}>Thương hiệu</div>
                                <div style={{ flex: '2', padding: '0.75rem', color: '#333' }}>{product.brand}</div>
                            </div>

                            {/* Dynamic Attributes from JSON */}
                            {Object.entries(attributes)
                                .filter(([key, value]) => !['thumbnailUrl', 'detailImageUrls', 'imageUrl'].includes(key) && value !== null && value !== '')
                                .slice(0, 5)
                                .map(([key, value]) => (
                                    <div key={key} style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem' }}>
                                        <div style={{ flex: '1', backgroundColor: '#f9f9f9', padding: '0.75rem', fontWeight: 600, borderRight: '1px solid #e5e7eb', textTransform: 'capitalize' }}>
                                            {specLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                                        </div>
                                        <div style={{ flex: '2', padding: '0.75rem', color: '#333' }}>
                                            {Array.isArray(value) ? value.join(', ') : (value !== null && value !== '' ? String(value) : '-')}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {Object.entries(attributes).length > 5 && (
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setIsSpecModalOpen(true)}
                                    style={{ backgroundColor: 'white', border: '1px solid #2563eb', color: '#2563eb', padding: '0.5rem 2rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                    Xem cấu hình chi tiết
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                        <div style={{ borderBottom: '2px solid #e30019', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', margin: 0, color: '#333', display: 'inline-block' }}>
                                SẢN PHẨM TƯƠNG TỰ
                            </h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                            {similarProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Thông Số Kỹ Thuật Chi Tiết */}
            {isSpecModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                        {/* Nút Close đỏ góc trên phải */}
                        <button 
                            onClick={() => setIsSpecModalOpen(false)}
                            style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#f44336', color: 'white', border: 'none', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                        >
                            <X size={20} />
                        </button>
                        
                        <div style={{ padding: '2rem', overflowY: 'auto' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#333', textTransform: 'uppercase' }}>Thông số kỹ thuật chi tiết</h2>
                            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb', fontSize: '0.9rem' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '30%', padding: '1rem', border: '1px solid #e5e7eb', fontWeight: 600, backgroundColor: '#f9f9f9' }}>Thương hiệu</td>
                                        <td style={{ padding: '1rem', border: '1px solid #e5e7eb', color: '#333' }}>{product.brand}</td>
                                    </tr>
                                    {Object.entries(attributes)
                                        .filter(([key, value]) => !['thumbnailUrl', 'detailImageUrls', 'imageUrl', 'originalPrice'].includes(key) && value !== null && value !== '')
                                        .map(([key, value]) => {
                                            const stringVal = String(value);
                                            const lines = stringVal.split('\n').filter(line => line.trim() !== '');
                                            return (
                                                <tr key={key}>
                                                    <td style={{ padding: '1rem', border: '1px solid #e5e7eb', fontWeight: 600, backgroundColor: '#f9f9f9', textTransform: 'capitalize' }}>
                                                        {specLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </td>
                                                    <td style={{ padding: 0, border: '1px solid #e5e7eb', color: '#333' }}>
                                                        {lines.map((line, idx) => (
                                                            <div key={idx} style={{ padding: '1rem', borderBottom: idx < lines.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                                                                {line}
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
