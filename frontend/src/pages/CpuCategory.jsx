import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Filter, ChevronUp, X } from 'lucide-react';
import cpuImage1 from '../assets/Images/CPU_Category/CPU1.png';
import cpuImage2 from '../assets/Images/CPU_Category/CPU2.png';
import cpuImage3 from '../assets/Images/CPU_Category/CPU3.png';
import cpuImage4 from '../assets/Images/CPU_Category/CPU4.png';

const CpuCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Filter States
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [minPrice, setMinPrice] = useState(500000);
    const [maxPrice, setMaxPrice] = useState(50000000);
    const [inStock, setInStock] = useState(false);

    const toggleSelection = (list, setList, item) => {
        if (list.includes(item)) setList(list.filter(i => i !== item));
        else setList([...list, item]);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                const allProds = res.data;
                const cpus = allProds.filter(p => 
                    p.name.toLowerCase().includes('cpu') || 
                    p.name.toLowerCase().includes('core') || 
                    p.name.toLowerCase().includes('ryzen') || 
                    p.name.toLowerCase().includes('intel') ||
                    p.name.toLowerCase().includes('amd')
                );
                
                // Show some UI filler even if db is empty
                if (cpus.length === 0) {
                    setProducts(allProds.slice(0, 12));
                } else {
                    setProducts(cpus);
                }
            } catch (err) {
                console.error("Failed to load CPU products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filters = [
        { label: 'Tình trạng sản phẩm' },
        { label: 'Khoảng giá' },
        { label: 'Hãng' },
        { label: 'Dòng CPU' },
        { label: 'Socket' },
        { label: 'Thế hệ' },
        { label: 'Đồ họa tích hợp' }
    ];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}>Đang tải dữ liệu bộ vi xử lý...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Breadcrumb */}
            <div style={{ backgroundColor: 'white', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <div className="container" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <Link to="/" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Trang chủ</Link> / 
                    <span style={{ color: '#334155', marginLeft: '0.5rem', fontWeight: 600 }}>CPU - Bộ vi xử lý</span>
                </div>
            </div>

            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Filter Box */}
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
                            <div style={{ position: 'absolute', top: '-10px', left: '2rem', width: '20px', height: '20px', backgroundColor: 'white', transform: 'rotate(45deg)', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }} />
                            
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
                                    <div style={{ position: 'relative', width: '230px', height: '20px' }}>
                                        <div style={{ position: 'absolute', top: '8px', left: 0, right: 0, height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
                                        <div style={{ 
                                            position: 'absolute', top: '8px', 
                                            left: `${(minPrice / 50000000) * 100}%`, 
                                            right: `${100 - (maxPrice / 50000000) * 100}%`, 
                                            height: '4px', backgroundColor: '#16a34a', borderRadius: '2px' 
                                        }} />
                                        <input 
                                            type="range" 
                                            min="0" max="50000000" step="100000"
                                            value={minPrice} 
                                            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', margin: 0, pointerEvents: 'none', appearance: 'none', background: 'transparent' }} 
                                            className="custom-range"
                                        />
                                        <input 
                                            type="range" 
                                            min="0" max="50000000" step="100000"
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
                                        {['Intel', 'AMD'].map(brand => {
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

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '2rem' }}>
                                {/* Dòng CPU */}
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Dòng CPU</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9', 'Pentium', 'Athlon'].map(model => {
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

                                {/* Socket, thế hệ... (để trống placeholder theo UI) */}
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Các bộ lọc khác hiện chưa khả dụng</div>
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
                        <div key={i} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', transition: 'box-shadow 0.2s', ':hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}}>
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

                {/* SEO Text Section from CPU.txt */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '2rem', position: 'relative' }}>
                    <div style={{ 
                        maxHeight: isTextExpanded ? 'none' : '300px', 
                        overflow: 'hidden', 
                        color: '#334155', 
                        lineHeight: 1.6, 
                        fontSize: '0.95rem' 
                    }}>
                        <p><span style={{color: '#0ea5e9', fontWeight: 500}}>CPU</span> hay còn gọi là Central Processing Unit, được biết đến là nơi xử lý mọi tác vụ, thông tin, dữ liệu trên PC hoặc laptop, CPU chính là bộ não của mọi hệ thống máy tính, PC và laptop.</p>

                        <h3 style={{ margin: '1.5rem 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Bộ vi xử lý CPU là gì?</h3>
                        <p>Bộ vi xử lý (CPU) thường được ví von như "bộ não" của máy tính bởi nó là thành phần quan trọng chịu trách nhiệm xử lý, điều phối các thông tin và dữ được truyền qua các thành phần khác của máy tính hay laptop. Bộ vi xử lý là nơi trung tâm xử lý mọi công việc trên máy tính, laptop. Tốc độ có thể lên đến hàng triệu lệnh mỗi giây.</p>
                        <img src={cpuImage1} alt="CPU Component 1" style={{ width: '100%', height: 'auto', borderRadius: '8px', margin: '1.5rem 0' }} />

                        <h3 style={{ margin: '1.5rem 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Cần lưu ý điều gì khi lựa chọn CPU</h3>
                        <p>Cũng giống như bao linh kiện máy tính khác, bạn phải dựa vào nhiều yếu tố để có thể lựa chọn CPU phù hợp với nhu cầu sử dụng của bản thân:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                            <li><b>Hiệu năng:</b> Nếu muốn xem xét về hiệu năng của CPU, bạn cần xem xét đến nhiều yếu tố như tốc độ xung nhịp, số nhân, số luồng, bộ nhớ đệm và kiến trúc của chip. Bởi những yếu tố này sẽ ảnh hưởng trực tiếp đến hiệu năng xử lý và thực thi các tác vụ trên máy tính.</li>
                            <li>
                                <b>Nhu cầu sử dụng:</b> Xác định mục đích sử dụng máy tính của bạn (ví dụ: chơi game, làm việc đồ họa, công việc văn phòng, lập trình) và tìm hiểu các yêu cầu tối thiểu và khuyến nghị cho cpu phù hợp với các tác vụ đó. Tất nhiên, nhu cầu sử dụng của bạn vẫn là một trong những yếu tố tiên quyết nên chọn mua CPU nào cho phù hợp. Ví dụ như chơi game hardcore, thiết kế đồ họa hay những tác vụ văn phòng cơ bản cùng bộ Office 365.
                                <div style={{ marginTop: '1rem' }}>
                                    <img src={cpuImage2} alt="CPU Usage" style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }} />
                                </div>
                            </li>
                            <li><b>Khả năng tương thích:</b> Ít newbie nào để tâm đến việc này nhưng nó lại là một yếu tố cực kỳ quan trọng. Bạn sẽ không thể đặt CPU vào hệ thống nếu nó không tương thích với mainboard cả socket trên hệ thống. Đúng thật CPU mạnh nhưng không thể hoạt động trên máy tính hay laptop thì thật là vô nghĩa.</li>
                            <li><b>Tiêu thụ điện năng:</b> Hệ thống PC của bạn sẽ tiêu tốn hết bao nhiêu điện hay laptop của bạn có bị quá nhiệt hay không, vậy thì bạn phải biết được mức độ tiêu thụ điện của CPU là bao nhiêu trong lúc xem xét và lựa chọn.</li>
                        </ul>

                        <h3 style={{ margin: '1.5rem 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Những dòng CPU Intel nên mua</h3>
                        <p>Một số dòng CPU Intel có thể kể đến như:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                            <li><span style={{color: '#0ea5e9', fontWeight: 600}}>Intel Core i9:</span> Đây là con chip cao cấp nhất của Intel thời điểm hiện tại. Nó sở hữu hiệu năng vượt trội để thực hiện những tác vụ khó, yêu cầu sức mạnh xử lý khủng như đồ họa, chơi game hardcore, render, chỉnh sửa hình ảnh, video,...</li>
                            <li><span style={{color: '#0ea5e9', fontWeight: 600}}>Intel Core i7:</span> Intel Core i7 cũng mạnh không kém và là sự lựa chọn hàng đầu của nhiều đối tượng người dùng. Số nhân số luồng đa dạng mang lại hiệu suất cao để chiếm mọi tựa game hot trên thị trường.</li>
                            <li><span style={{color: '#0ea5e9', fontWeight: 600}}>Intel Core i5:</span> Đối với những người dùng phổ thông thì Intel Core i5 là sự lựa chọn hoàn hảo nhất. Bởi nó mang đến sức mạnh đủ lớn và đủ ổn định để thực hiện các tác vụ văn phòng, chơi game với mức đồ họa trung bình.</li>
                            <li>
                                <span style={{color: '#0ea5e9', fontWeight: 600}}>Intel Core i3:</span> Nếu bạn không yêu cầu quá cao về hiệu năng và chỉ cần một hệ thống PC nhẹ nhàng, vừa đủ dùng vừa đủ giải trí thì Intel Core i3 sẽ không khiến bạn thất vọng. Giá thành hợp lý cùng hiệu năng ổn định, Intel Core i3 rất phù hợp với đối tượng người dùng phổ thông.
                                <div style={{ marginTop: '1rem' }}>
                                    <img src={cpuImage3} alt="CPU Intel i3" style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }} />
                                </div>
                            </li>
                        </ul>

                        <h3 style={{ margin: '1.5rem 0 0.5rem', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Dòng CPU AMD nên mua</h3>
                        <p>Tất nhiên CPU AMD cũng có nhiều series tương tự như đối thủ của mình để người dùng tham khảo:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                            <li><span style={{color: '#ef4444', fontWeight: 600}}>AMD Ryzen 9:</span> Đây cũng được xem là CPU cao cấp nhất của nhà AMD. Với nhiều nhân, nhiều luồng, bộ nhớ đệm lớn cùng kiến trúc hiện đại qua từng thế hệ, AMD Ryzen 9 thích hợp cho những người dùng thường xuyên làm việc trong lĩnh vực đồ họa, kỹ thuật số, chơi game hardcore và chỉnh sửa video.</li>
                            <li><span style={{color: '#ef4444', fontWeight: 600}}>AMD Ryzen 7:</span> Với một mức giá dễ tiếp cận hơn thì AMD Ryzen 7 sẽ là sự lựa chọn hàng đầu. Sở hữu sức mạnh không thua kém gì dòng R9 đình đám.</li>
                            <li><span style={{color: '#ef4444', fontWeight: 600}}>AMD Ryzen 5:</span> Đây là sự lựa chọn phổ biến cho người dùng phổ thông, khi công việc văn phòng và chơi những tựa game nhẹ không yêu cầu một hiệu năng quá khủng. Ryzen 5 mang lại hiệu suất tốt với mức giá phải chăng, phù hợp với đại đa số người dùng.</li>
                            <li>
                                <span style={{color: '#ef4444', fontWeight: 600}}>AMD Ryzen 3:</span> Nếu bạn có ngân sách đôi phần hạn chế thì vẫn có thể tham khảo AMD Ryzen 3. Nó vẫn đủ mạnh để bạn những công việc cơ bản hằng ngày một cách trơn tru đó nhé!
                                <div style={{ marginTop: '1rem' }}>
                                    <img src={cpuImage4} alt="CPU AMD Ryzen 3" style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }} />
                                </div>
                            </li>
                        </ul>
                    </div>

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
                
                {/* Reveal Text Button */}
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

export default CpuCategory;
