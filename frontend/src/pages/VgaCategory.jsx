import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Filter, ChevronUp, X } from 'lucide-react';

const VgaCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Filter States
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [minPrice, setMinPrice] = useState(1000000);
    const [maxPrice, setMaxPrice] = useState(100000000);
    const [inStock, setInStock] = useState(false);

    const toggleSelection = (list, setList, item) => {
        if (list.includes(item)) setList(list.filter(i => i !== item));
        else setList([...list, item]);
    };

    useEffect(() => {
        const fetchVgaProducts = async () => {
            try {
                // Fetch all products, then filter locally for "VGA"-like products
                // In a real scenario, this would be api.get('/products?category=vga')
                const res = await api.get('/products');
                const allProds = res.data;
                const vgas = allProds.filter(p =>
                    p.name.toLowerCase().includes('rtx') ||
                    p.name.toLowerCase().includes('gtx') ||
                    p.name.toLowerCase().includes('rx ') ||
                    p.name.toLowerCase().includes('vga') ||
                    p.name.toLowerCase().includes('card')
                );

                // If the filter yields no items (db is empty), show a duplicate grid of what we have just to fill out the UI
                if (vgas.length === 0) {
                    setProducts(allProds.slice(0, 12));
                } else {
                    setProducts(vgas);
                }
            } catch (err) {
                console.error("Failed to load VGA products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVgaProducts();
    }, []);

    // Static Mock Filters based on screenshot
    const filters = [
        { label: 'Tình trạng sản phẩm' },
        { label: 'Khoảng giá' },
        { label: 'Hãng' },
        { label: 'Dòng VGA' },
        { label: 'Dung lượng bộ nhớ' },
        { label: 'Nhân đồ họa' }
    ];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Đang tải dữ liệu card màn hình...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Breadcrumb Area */}
            <div style={{ backgroundColor: 'white', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <div className="container" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Trang chủ</Link> /
                    <span style={{ color: '#334155', marginLeft: '0.5rem', fontWeight: 600 }}>VGA - Card màn hình</span>
                </div>
            </div>

            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Filter Header Box */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                        <div 
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer', backgroundColor: showFilterMenu ? '#f1f5f9' : 'white' }}
                        >
                            <Filter size={16} /> Bộ lọc
                        </div>

                        {filters.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#334155', cursor: 'pointer', backgroundColor: '#f8fafc' }}>
                                {f.label} <ChevronDown size={14} />
                            </div>
                        ))}
                    </div>

                    {showFilterMenu && (
                        <div style={{ 
                            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '1rem', 
                            backgroundColor: 'white', padding: '2rem', borderRadius: '8px', 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 100 
                        }}>
                            {/* Visual Caret pointing to button */}
                            <div style={{ position: 'absolute', top: '-10px', left: '2rem', width: '20px', height: '20px', backgroundColor: 'white', transform: 'rotate(45deg)', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }} />
                            
                            {/* Close button */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                                <button onClick={() => setShowFilterMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
                                    <X size={16} /> Đóng
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(250px, 1.5fr) 2fr', gap: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem', marginBottom: '2rem' }}>
                                {/* Tình trạng sản phẩm */}
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Tình trạng sản phẩm</div>
                                    <button 
                                        onClick={() => setInStock(!inStock)}
                                        style={{ 
                                            padding: '0.5rem 1.5rem', backgroundColor: 'white', 
                                            border: `1px solid ${inStock ? '#ef4444' : '#cbd5e1'}`, 
                                            borderRadius: '4px', fontWeight: inStock ? 600 : 500, 
                                            color: inStock ? '#ef4444' : '#334155', 
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >
                                        Sẵn hàng
                                    </button>
                                </div>

                                {/* Giá */}
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Giá</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <input 
                                            type="text" 
                                            value={`${minPrice.toLocaleString('vi-VN')}đ`} 
                                            readOnly
                                            style={{ width: '100px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem', outline: 'none', backgroundColor: '#f8fafc' }} 
                                        />
                                        <span style={{ borderTop: '1px solid #94a3b8', width: '20px' }}></span>
                                        <input 
                                            type="text" 
                                            value={`${maxPrice.toLocaleString('vi-VN')}đ`} 
                                            readOnly
                                            style={{ width: '100px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem', outline: 'none', backgroundColor: '#f8fafc' }} 
                                        />
                                    </div>
                                    {/* Dual Slider Overlay Layout */}
                                    <div style={{ position: 'relative', width: '230px', height: '20px' }}>
                                        {/* Background Track */}
                                        <div style={{ position: 'absolute', top: '8px', left: 0, right: 0, height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
                                        {/* Colored Track matching selection */}
                                        <div style={{ 
                                            position: 'absolute', top: '8px', 
                                            left: `${(minPrice / 100000000) * 100}%`, 
                                            right: `${100 - (maxPrice / 100000000) * 100}%`, 
                                            height: '4px', backgroundColor: '#16a34a', borderRadius: '2px' 
                                        }} />
                                        
                                        <input 
                                            type="range" 
                                            min="0" max="100000000" step="500000"
                                            value={minPrice} 
                                            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', margin: 0, pointerEvents: 'none', appearance: 'none', background: 'transparent' }} 
                                            className="custom-range"
                                        />
                                        <input 
                                            type="range" 
                                            min="0" max="100000000" step="500000"
                                            value={maxPrice} 
                                            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', margin: 0, pointerEvents: 'none', appearance: 'none', background: 'transparent' }} 
                                            className="custom-range"
                                        />
                                    </div>
                                    <style>{`
                                        .custom-range::-webkit-slider-thumb {
                                            pointer-events: auto;
                                            appearance: none;
                                            width: 14px;
                                            height: 14px;
                                            background-color: #16a34a;
                                            border-radius: 50%;
                                            cursor: pointer;
                                            position: relative;
                                            top: -2px;
                                        }
                                    `}</style>
                                </div>

                                {/* Hãng */}
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Hãng</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {['Asus', 'Colorful', 'EVGA', 'GIGABYTE', 'INNO3D', 'Không thương hiệu', 'Leadtek', 'MSI', 'Manli', 'Palit', 'Sparkle', 'Zotac'].map(brand => {
                                            const isSelected = selectedBrands.includes(brand);
                                            return (
                                                <button 
                                                    key={brand} 
                                                    onClick={() => toggleSelection(selectedBrands, setSelectedBrands, brand)}
                                                    style={{ 
                                                        padding: '0.4rem 0.8rem', backgroundColor: 'white', 
                                                        border: `1px solid ${isSelected ? '#ef4444' : '#cbd5e1'}`, 
                                                        borderRadius: '4px', fontSize: '0.85rem', 
                                                        color: isSelected ? '#ef4444' : '#334155', 
                                                        fontWeight: isSelected ? 600 : 400,
                                                        cursor: 'pointer', transition: 'all 0.2s' 
                                                    }}
                                                >
                                                    {brand}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Dòng VGA */}
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Dòng VGA</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {['GT 730', 'GTX 1650', 'GTX 1660S', 'GTX 1660ti', 'RTX 2060', 'RTX 3050', 'RTX 3060', 'RTX 3060ti', 'RTX 3080', 'RTX 3080ti', 'RTX 4060', 'RTX 4060ti', 'RTX 4070', 'RTX 4070ti', 'RTX 4070S', 'RTX 4070ti Super', 'RTX 4080', 'RTX 4080 Super', 'RTX 4090'].map(model => {
                                            const isSelected = selectedModels.includes(model);
                                            return (
                                                <button 
                                                    key={model} 
                                                    onClick={() => toggleSelection(selectedModels, setSelectedModels, model)}
                                                    style={{ 
                                                        padding: '0.4rem 0.6rem', backgroundColor: 'white', 
                                                        border: `1px solid ${isSelected ? '#ef4444' : '#cbd5e1'}`, 
                                                        borderRadius: '4px', fontSize: '0.85rem', 
                                                        color: isSelected ? '#ef4444' : '#334155', 
                                                        fontWeight: isSelected ? 600 : 400,
                                                        cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {model}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Dung lượng bộ nhớ */}
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Dung lượng bộ nhớ</div>
                                    {/* Empty area as per screenshot */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort Header */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
                        Sắp xếp theo:
                        <select style={{ padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none', backgroundColor: 'white', fontWeight: 600 }}>
                            <option>Nổi bật</option>
                            <option>Giá tăng dần</option>
                            <option>Giá giảm dần</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
                    {products.map((p, i) => (
                        <div key={i} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', transition: 'box-shadow 0.2s', ':hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}>
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button style={{
                        border: '1px solid #0ea5e9', color: '#0ea5e9', backgroundColor: 'white',
                        padding: '0.6rem 3rem', borderRadius: '4px', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#0ea5e9'; e.target.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#0ea5e9'; }}
                    >
                        Xem thêm sản phẩm
                    </button>
                </div>

                {/* SEO Text Section */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '2rem', position: 'relative' }}>
                    <div style={{
                        maxHeight: isTextExpanded ? 'none' : '300px',
                        overflow: 'hidden',
                        color: '#334155',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                    }}>
                        <p>Card màn hình là một phần cứng quan trọng khi build PC với mọi người dùng như designer, sáng tạo nội dung và game thủ. Hãy cùng tìm hiều về <span style={{ color: '#0ea5e9', fontWeight: 500 }}>linh kiện máy tính</span> tuyệt vời này ngay sau đây nhé !</p>

                        <h3 style={{ margin: '1.5rem 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Card màn hình là gì?</h3>
                        <p><span style={{ color: '#0ea5e9', fontWeight: 500 }}>Card màn hình</span> là một linh kiện mở rộng được sử dụng trên những chiếc bộ PC (máy tính bàn), thường được gọi với nhiều tên khác như VGA, GPU, card đồ họa,... Card màn hình đóng vai trò trong việc chuyển hóa, xử lý hình ảnh và đưa lên những thiết bị trình chiếu như <span style={{ color: '#0ea5e9', fontWeight: 500 }}>màn hình máy tính</span>.</p>

                        <p style={{ marginTop: '0.5rem' }}>Hiện nay, card màn hình đã không còn xa lạ với mọi người dùng công nghệ, đặc biệt thường xuyên sử dụng PC. Card màn hình đóng vai trò cực kì quan trọng trong mọi cấu hình PC từ <span style={{ color: '#0ea5e9', fontWeight: 500 }}>PC Gaming, PC đồ họa</span> đến những siêu thiết bị để tạo nên những siêu phẩm hình ảnh như phim ảnh, video.</p>

                        <h3 style={{ margin: '1.5rem 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Công dụng của card màn hình</h3>
                        <p>Được biết đến với khả năng xử lý đồ họa và xuất ra những hình ảnh tốt hơn trên màn hình máy tính, card màn hình là một thành phần vô cùng lý tưởng cho mọi người dùng và những công dụng hữu ích như:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                            <li>Xử lý các hình ảnh phức tạp của những dự án lớn như phim ảnh, MV với tần suất dày đặc của các hiệu ứng đi kèm.</li>
                            <li>Nâng cao trải nghiệm giải trí của người dùng về mặt hình ảnh, đặc biệt là game thủ với những tựa game yêu cầu cao về đồ họa.</li>
                            <li>Cho phép kết nối nhiều màn hình cùng một lúc, tăng cường năng suất làm việc và trải nghiệm đa màn hình.</li>
                        </ul>

                        <h3 style={{ margin: '1.5rem 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Phân loại card màn hình</h3>
                        <p>Hiện nay, card màn hình được phân chia thành 2 loại là card đồ họa tích hợp (Integrated graphics card) và card đồ họa rời hay card rời (Dedicated graphics card).</p>

                        <h4 style={{ margin: '1rem 0 0.5rem', color: '#0f172a', fontWeight: 700 }}>1. Card đồ họa tích hợp (Integrated Graphics Card)</h4>
                        <p>Card đồ họa tích hợp là công nghệ xử lý đồ họa được tích hợp trực tiếp vào trong những chiếc <span style={{ color: '#0ea5e9', fontWeight: 500 }}>CPU</span> hay thậm chí là <span style={{ color: '#0ea5e9', fontWeight: 500 }}>mainboard</span>. Không còn sở hữu hình dáng vật lý nhưng vẫn giữ nguyên sức mạnh xử lý hình ảnh đến cho mọi bộ máy, tuy nhiên công nghệ xử lý từ card đồ họa tích hợp không được đánh giá cao cho những nhu cầu sử dụng yêu cầu cao về cấu hình.</p>
                        <p style={{ marginTop: '0.5rem' }}>Card đồ họa tích hợp dễ dàng được tìm thấy trên những chiếc <span style={{ color: '#0ea5e9', fontWeight: 500 }}>laptop</span> như <span style={{ color: '#0ea5e9', fontWeight: 500 }}>laptop văn phòng, laptop gaming</span> giá rẻ; đặc biệt, đó là trường hợp của những chiếc laptop trang bị CPU Intel Evo. Không chỉ có đội xanh mà AMD cũng đã sở hữu cho mình những chiếc laptop trang bị vi xử lý từ AMD mạnh mẽ đi cùng card đồ họa tích hợp uy tín.</p>

                        <h4 style={{ margin: '1rem 0 0.5rem', color: '#0f172a', fontWeight: 700 }}>2. Card đồ họa rời (Dedicated Graphics Card)</h4>
                        <p>Những điểm yếu của hiệu năng xử lý từ card đồ họa tích hợp đều được cải tiến trên card đồ họa rời. Card đồ họa rời sở hữu cho mình hình dáng vật lý cụ thể, bao gồm GPU với nhiều vi mạch và có bộ khung rõ ràng kết nối với nhau tạo nên một tổng thể hoàn thiện.</p>
                        <p style={{ marginTop: '0.5rem' }}>Nhờ đó, những thương hiệu sản xuất card dễ dàng áp dụng công nghệ của mình lên sản phẩm. Sức mạnh của từng chiếc card đồ họa rời được hội tụ từ GPU và hiện nay những GPU từ thế hệ RTX 40 Series đang thể hiện sự vượt trội cho mọi cấu hình PC Gaming, điển hình như <span style={{ color: '#0ea5e9', fontWeight: 500 }}>RTX 4090, RTX 4080, RTX 4070</span>.</p>

                        <h4 style={{ margin: '2rem 0 1rem 0', color: '#0f172a', fontWeight: 700 }}>Kinh nghiệm chọn mua card màn hình khi build PC</h4>
                        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid #cbd5e1', padding: '0.75rem', backgroundColor: '#f1f5f9', width: '30%', textAlign: 'center' }}>Tiêu chí</th>
                                        <th style={{ border: '1px solid #cbd5e1', padding: '0.75rem', backgroundColor: '#f1f5f9', width: '70%', textAlign: 'center' }}>Lưu ý</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '1rem', fontWeight: 600 }}>Nhu cầu sử dụng</td>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '1rem', fontSize: '0.85rem' }}>
                                            Xác định rõ mục đích sử dụng và lựa chọn chiếc card màn hình phù hợp nhất.<br />
                                            Với chơi game thì ở những tựa game Esport, chúng ta sẽ cần những GPU tầm trung như GTX 16 Series, RTX 20 Series. Đối với công việc liên quan nhiều đến đồ họa thì những GPU RTX 30 Series, RTX 40 Series sẽ là những lựa chọn lý tưởng cho nhu cầu hiện tại cũng như tương lai.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '1rem', fontWeight: 600 }}>Thương hiệu</td>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '1rem', fontSize: '0.85rem' }}>
                                            Trên thị trường hiện nay chỉ có 2 thương hiệu nổi tiếng là NVIDIA và AMD.<br />
                                            Đi kèm với đó là những nhà sản xuất VGA phổ biến như ASUS, MSI, GIGABYTE,...
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '1rem', fontWeight: 600 }}>Tương thích hệ thống</td>
                                        <td style={{ border: '1px solid #cbd5e1', padding: '1rem', fontSize: '0.85rem' }}>
                                            Hãy đảm bảo card màn hình bạn chọn sẽ tương thích với các linh kiện khác như bo mạch chủ, CPU, nguồn máy tính và phù hợp với kích thước của case máy tính.
                                            Nếu bạn không phải là một người quá am hiểu về điều này, bạn có thể hỏi trực tiếp những nhân viên; hoặc lựa chọn những cấu hình được build sẵn từ cửa hàng.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Gradient overlay when collapsed */}
                    {!isTextExpanded && (
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            right: '0',
                            height: '120px',
                            background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: '1rem',
                            pointerEvents: 'none'
                        }} />
                    )}
                </div>

                {/* Expand / Collapse Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1rem', zIndex: 10 }}>
                    <button
                        onClick={() => setIsTextExpanded(!isTextExpanded)}
                        style={{
                            border: '1px solid #e2e8f0', color: '#0ea5e9', backgroundColor: 'white',
                            padding: '0.6rem 2.5rem', borderRadius: '4px', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {isTextExpanded ? (
                            <>Thu gọn <ChevronUp size={16} /></>
                        ) : (
                            <>Hiển thị chi tiết <ChevronDown size={16} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VgaCategory;
