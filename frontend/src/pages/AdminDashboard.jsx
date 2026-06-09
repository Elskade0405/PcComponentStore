import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, Edit, Trash2, Plus, LayoutDashboard, Users, Tags, X, Image, Upload } from 'lucide-react';
import ComponentPickerModal from '../components/ComponentPickerModal';
import API_URL from '../config';

const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
                }, 'image/jpeg', quality);
            };
            img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
    });
};

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const userRole = user?.role || '';
    const getDefaultTab = () => {
        if (userRole === 'SalesStaff') return 'orders';
        return 'settings';
    };
    const [activeTab, setActiveTab] = useState(getDefaultTab());
    const [loading, setLoading] = useState(true);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [pcPickerModalOpen, setPcPickerModalOpen] = useState(false);
    const [pcActiveSlot, setPcActiveSlot] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    
    // Filtering states for products
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Settings state
    const [homeBannerUrl, setHomeBannerUrl] = useState('');
    const [leftBannerUrl, setLeftBannerUrl] = useState('');
    const [rightBannerUrl, setRightBannerUrl] = useState('');
    const [isSavingSetting, setIsSavingSetting] = useState(false);
    const [uploadingKey, setUploadingKey] = useState(null);

    const initialProductState = {
        type: 'cpu',
        name: '', brand: '', price: 0, originalPrice: 0, stockQuantity: 0,
        thumbnailUrl: '', detailImageUrls: [],
        socket: '', cores: '', baseClock: '', boostClock: '', cache: '', tdp: '', generation: '', generationName: '', threads: '', memorySupport: '', memoryChannels: '', pcieVersion: '', pcieLanes: '', cooling: '', graphicEngine: '', busStandard: '', vram: '', engineClock: '', cudaCores: '', memoryClock: '', memoryInterface: '', ports: '', dimensions: '', recommendedPsu: '', powerConnectors: '', directX: '',
        capacity: '', busSpeed: '', ramType: '', ramModel: '', overclock: '', rgb: '', voltage: '', casLatency: '', warranty: '',
        mainboardSize: '', ramSlots: '', chipset: '',
        driveType: '', connection: '', storageCapacity: '', readSpeed: '', writeSpeed: '', osSupport: '', operatingTemp: '', otherFeatures: '',
        screenSize: '', resolution: '', refreshRate: '',
        powerCapacity: '', efficiency: '', formFactor: '', modular: '', inputVoltage: '', psuFanSize: '',
        coolerType: '', supportedSockets: '', fanSpeed: '', airflow: '', noiseLevel: '', radiatorSize: '',
        pcCpu: '', pcMainboard: '', pcRam: '', pcVga: '', pcStorage: '', pcPsu: '', pcCase: ''
    };

    const [newProduct, setNewProduct] = useState(initialProductState);
    const [editingProductId, setEditingProductId] = useState(null);



    useEffect(() => {
        fetchAdminData();
        if (activeTab === 'settings') {
            fetchSettings();
        }
    }, [activeTab]);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            const settings = res.data || [];
            
            const homeBanner = settings.find(s => s.key === 'HOME_BANNER_URL');
            if (homeBanner) setHomeBannerUrl(homeBanner.value || '');
            
            const leftBanner = settings.find(s => s.key === 'LEFT_BANNER_URL');
            if (leftBanner) setLeftBannerUrl(leftBanner.value || '');
            
            const rightBanner = settings.find(s => s.key === 'RIGHT_BANNER_URL');
            if (rightBanner) setRightBannerUrl(rightBanner.value || '');
            
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };

    const handleSaveSetting = async () => {
        setIsSavingSetting(true);
        try {
            await Promise.all([
                api.post('/settings', { key: 'HOME_BANNER_URL', value: homeBannerUrl }),
                api.post('/settings', { key: 'LEFT_BANNER_URL', value: leftBannerUrl }),
                api.post('/settings', { key: 'RIGHT_BANNER_URL', value: rightBannerUrl })
            ]);
            alert('Lưu cài đặt thành công!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Lưu cài đặt thất bại!');
        } finally {
            setIsSavingSetting(false);
        }
    };

    const handleFileUpload = async (event, key) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingKey(key);
        try {
            const res = await api.post('/upload', formData);
            const url = API_URL + res.data.url;
            if (key === 'HOME_BANNER_URL') setHomeBannerUrl(url);
            else if (key === 'LEFT_BANNER_URL') setLeftBannerUrl(url);
            else if (key === 'RIGHT_BANNER_URL') setRightBannerUrl(url);
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Upload ảnh thất bại!');
        } finally {
            setUploadingKey(null);
        }
    };

    const renderBannerField = (label, key, value, setValue) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151' }}>{label}:</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="https://..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                />
                <div style={{ position: 'relative' }}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, key)} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                        disabled={uploadingKey === key}
                    />
                    <button style={{ height: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem', border: '1px solid #2563eb', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                        {uploadingKey === key ? <span className="spinner" style={{ width: '20px', height: '20px', border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span> : <Upload size={18} />}
                        Tải ảnh lên
                    </button>
                </div>
                <button 
                    onClick={() => setValue('')} 
                    style={{ height: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem', border: '1px solid #ef4444', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                    title="Xóa ảnh này"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            {value && (
                <div style={{ marginTop: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <img src={value} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '150px', objectFit: 'cover', display: 'block' }} />
                </div>
            )}
        </div>
    );

    const handleOpenPcPicker = (slotId) => {
        setPcActiveSlot(slotId);
        setPcPickerModalOpen(true);
    };

    const handleSelectPcPart = (product) => {
        const slotMap = {
            'cpu': 'pcCpu',
            'mainboard': 'pcMainboard',
            'ram': 'pcRam',
            'vga': 'pcVga',
            'storage': 'pcStorage',
            'psu': 'pcPsu',
            'case': 'pcCase'
        };
        const stateKey = slotMap[pcActiveSlot];
        if (stateKey) {
            setNewProduct(prev => ({ ...prev, [stateKey]: product.name }));
        }
        setPcPickerModalOpen(false);
    };

    const renderPcPartField = (label, stateKey, slotId) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#7e22ce' }}>{label}</label>
            {newProduct[stateKey] ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1rem', border: '1px solid #d8b4fe', borderRadius: '0.5rem', backgroundColor: '#faf5ff', minWidth: 0 }}>
                    <span style={{ fontSize: '0.9rem', color: '#4c1d95', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, paddingRight: '1rem', minWidth: 0 }}>
                        {newProduct[stateKey]}
                    </span>
                    <button type="button" onClick={() => handleOpenPcPicker(slotId)} style={{ background: 'none', border: 'none', color: '#7e22ce', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}>Thay đổi</button>
                </div>
            ) : (
                <button type="button" onClick={() => handleOpenPcPicker(slotId)} style={{ backgroundColor: '#fff', border: '1px dashed #c084fc', color: '#9333ea', padding: '0.6rem 1rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center' }}>
                    + Chọn linh kiện
                </button>
            )}
        </div>
    );

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'orders') {
                const res = await api.get('/orders/all');
                setOrders(res.data);
            } else if (activeTab === 'products') {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } else if (activeTab === 'users') {
                const res = await api.get('/users/all');
                setUsers(res.data);
            }
        } catch (error) {
            console.error(`Failed to fetch ${activeTab} data:`, error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            setSelectedOrder(res.data);
            setIsOrderModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            alert('Không thể tải chi tiết đơn hàng.');
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (newStatus === 'Delivered') {
            const confirm = window.confirm('Xác nhận đơn hàng này đã được giao thành công? (Sau khi xác nhận sẽ không thể hoàn tác hay chỉnh sửa).');
            if (!confirm) {
                // Force a re-render so the select box resets to its previous value visually
                setOrders([...orders]); 
                return;
            }
        }

        try {
            await api.put(`/orders/${orderId}/status`, JSON.stringify(newStatus), {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchAdminData();
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update order status');
        }
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
        try {
            await api.delete(`/products/${productId}`);
            fetchAdminData();
        } catch (error) {
            console.error('Failed to delete product', error);
            alert('Không thể xóa sản phẩm. Có thể sản phẩm đang nằm trong một đơn hàng.');
        }
    };

    const handleSaveProduct = async () => {
        try {
            if (editingProductId) {
                await api.put(`/products/${editingProductId}`, newProduct);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await api.post('/products', newProduct);
                alert('Thêm sản phẩm thành công!');
            }
            setIsAddProductModalOpen(false);
            setNewProduct(initialProductState);
            setEditingProductId(null);
            fetchAdminData();
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            alert(error.response?.data?.message || error.response?.data || error.message || 'Có lỗi xảy ra khi lưu sản phẩm vào DB.');
        }
    };

    const openEditProduct = (product) => {
        let parsedAttr = {};
        try { 
            if (product.attributes) {
                const rawAttr = JSON.parse(product.attributes); 
                for (const key in rawAttr) {
                    if (key === 'originalPrice' || key === 'category' || key === 'detailImageUrls' || key === 'thumbnailUrl') {
                        parsedAttr[key] = rawAttr[key];
                    } else {
                        parsedAttr[key] = rawAttr[key] != null ? String(rawAttr[key]) : '';
                    }
                }
            }
        } catch (e) {}
        
        setNewProduct({
            ...initialProductState,
            ...parsedAttr,
            type: parsedAttr.category || 'cpu',
            name: product.name || '',
            brand: product.brand || '',
            price: product.price || 0,
            originalPrice: parsedAttr.originalPrice || 0,
            stockQuantity: product.stock || 0,
        });
        setEditingProductId(product.id);
        setIsAddProductModalOpen(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Pending': return { bg: '#fffbeb', text: '#d97706' }; // Amber
            case 'Processing': return { bg: '#eff6ff', text: '#2563eb' }; // Blue
            case 'Shipped': return { bg: '#ecfdf5', text: '#059669' }; // Emerald
            case 'Delivered': return { bg: '#dcfce7', text: '#16a34a' }; // Green
            case 'Cancelled': return { bg: '#fef2f2', text: '#dc2626' }; // Red
            default: return { bg: '#f3f4f6', text: '#6b7280' }; // Gray
        }
    };

    let navItems = [];
    if (userRole === 'Admin' || userRole === 'Manager') {
        navItems = [
            { id: 'settings', label: 'Cấu hình Web', icon: Image },
            { id: 'orders', label: 'Đơn hàng', icon: Package },
            { id: 'products', label: 'Sản phẩm', icon: Truck },
            { id: 'users', label: 'Tài khoản', icon: Users },
        ];
    } else if (userRole === 'Editor') {
        navItems = [
            { id: 'settings', label: 'Cấu hình Web', icon: Image },
            { id: 'products', label: 'Sản phẩm', icon: Truck },
        ];
    } else if (userRole === 'SalesStaff') {
        navItems = [
            { id: 'orders', label: 'Đơn hàng', icon: Package },
        ];
    }

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)', backgroundColor: '#f9fafb' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '1.5rem 1rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem', color: '#111827', paddingLeft: '0.75rem' }}>Quản Trị Viên</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%',
                                    borderRadius: '0.5rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                                    fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s',
                                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                    color: isActive ? '#2563eb' : '#4b5563'
                                }}
                            >
                                <Icon size={20} color={isActive ? '#2563eb' : '#6b7280'} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '2rem 3rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '2rem' }}>
                    {navItems.find(i => i.id === activeTab)?.label}
                </h1>

                {/* --- Settings Tab --- */}
                {activeTab === 'settings' && (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1f2937' }}>Cài Đặt Trang Chủ</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
                            {renderBannerField('Banner Chính giữa (Hero Banner)', 'HOME_BANNER_URL', homeBannerUrl, setHomeBannerUrl)}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {renderBannerField('Banner Trái', 'LEFT_BANNER_URL', leftBannerUrl, setLeftBannerUrl)}
                                {renderBannerField('Banner Phải', 'RIGHT_BANNER_URL', rightBannerUrl, setRightBannerUrl)}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
                                <button
                                    onClick={handleSaveSetting}
                                    disabled={isSavingSetting}
                                    style={{ padding: '0.75rem 2rem', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', opacity: isSavingSetting ? 0.7 : 1 }}
                                >
                                    {isSavingSetting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Orders Tab --- */}
                {activeTab === 'orders' && (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Mã Đơn</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Khách Hàng</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Ngày Đặt</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Tổng Tiền</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Trạng Thái</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
                                ) : orders.map(order => {
                                    const badgeStyle = getStatusBadgeClass(order.status);
                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>#{order.id}</td>
                                            <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{order.user?.fullName || order.user?.email || 'N/A'}</td>
                                            <td style={{ padding: '1rem', color: '#4b5563', fontSize: '0.9rem' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem', color: '#059669', fontWeight: 600 }}>${order.totalAmount.toLocaleString()}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <select
                                                        style={{ 
                                                            padding: '0.35rem', 
                                                            border: '1px solid #d1d5db', 
                                                            borderRadius: '0.375rem', 
                                                            fontSize: '0.875rem', 
                                                            outline: 'none',
                                                            backgroundColor: order.status === 'Delivered' ? '#f3f4f6' : 'white',
                                                            cursor: order.status === 'Delivered' ? 'not-allowed' : 'pointer'
                                                        }}
                                                        value={order.status}
                                                        disabled={order.status === 'Delivered'}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    >
                                                        <option value="Pending">Chờ xử lý</option>
                                                        <option value="Processing">Đang xuất kho</option>
                                                        <option value="Shipped">Đang giao</option>
                                                        <option value="Delivered">Đã giao</option>
                                                        <option value="Cancelled">Đã hủy</option>
                                                    </select>
                                                    <button 
                                                        onClick={() => fetchOrderDetails(order.id)}
                                                        style={{ padding: '0.35rem 0.75rem', backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}
                                                    >
                                                        Chi tiết
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {orders.length === 0 && !loading && (
                                    <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Chưa có đơn hàng nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- Products Tab --- */}
                {activeTab === 'products' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm tên sản phẩm hoặc ID..." 
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', flex: 1, maxWidth: '400px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <select 
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    <option value="cpu">Bộ vi xử lý (CPU)</option>
                                    <option value="mainboard">Bo mạch chủ (Mainboard)</option>
                                    <option value="vga">Chuyên xử lý đồ hoạ (VGA)</option>
                                    <option value="ram">Bộ nhớ trong (RAM)</option>
                                    <option value="storage">Ổ cứng (SSD/HDD)</option>
                                    <option value="psu">Nguồn (PSU)</option>
                                    <option value="cooling">Tản nhiệt (Cooling)</option>
                                    <option value="monitor">Màn hình Gaming</option>
                                    <option value="pc">PC Lắp ráp sẵn</option>
                                </select>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingProductId(null);
                                    setNewProduct(initialProductState);
                                    setIsAddProductModalOpen(true);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                                <Plus size={18} /> Thêm Sản Phẩm Mới
                            </button>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>ID</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Tên Sản Phẩm</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Danh Mục</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Giá</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Tồn Kho</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textAlign: 'right' }}>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
                                    ) : (() => {
                                        const filteredProducts = products.filter(p => {
                                            const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString() === searchTerm;
                                            const matchesCategory = filterCategory === '' || p.categoryName === filterCategory;
                                            return matchesSearch && matchesCategory;
                                        });

                                        if (filteredProducts.length === 0) {
                                            return <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Không tìm thấy sản phẩm nào phù hợp</td></tr>;
                                        }

                                        return filteredProducts.map(product => (
                                            <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>{product.id}</td>
                                                <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{product.name}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 500, textTransform: 'capitalize' }}>
                                                        {product.categoryName || 'Khác'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', color: '#dc2626', fontWeight: 600 }}>{product.price.toLocaleString()}đ</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ color: product.stockQuantity < 5 ? '#dc2626' : '#111827', fontWeight: 500 }}>
                                                        {product.stockQuantity}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => openEditProduct(product)} style={{ padding: '0.4rem', color: '#4b5563', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: 'pointer' }}>
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => deleteProduct(product.id)} style={{ padding: '0.4rem', color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', cursor: 'pointer' }}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ));
                                    })()}

                                    {products.length === 0 && !loading && (
                                        <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Chưa có sản phẩm nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- Users Tab --- */}
                {activeTab === 'users' && (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>ID</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Tài khoản (Username)</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Mật khẩu (Password)</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Email</th>
                                    <th style={{ padding: '1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Loại (Role)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
                                ) : users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>{u.id}</td>
                                        <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{u.username}</td>
                                        <td style={{ padding: '1rem', color: '#dc2626', fontWeight: 500 }}>{u.passwordHash}</td>
                                        <td style={{ padding: '1rem', color: '#4b5563', fontSize: '0.9rem' }}>{u.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ backgroundColor: u.roleType === 'admin' ? '#fef3c7' : '#f3f4f6', color: u.roleType === 'admin' ? '#92400e' : '#4b5563', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                                {u.roleType}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && !loading && (
                                    <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Chưa có người dùng nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- Placeholders for other tabs --- */}
                {(activeTab === 'dashboard') && (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        <p>Khu vực quản lý {navItems.find(i => i.id === activeTab)?.label.toLowerCase()} (Đang xây dựng...)</p>
                    </div>
                )}
            </main>

            {/* --- Add Product Modal Placeholder --- */}
            {isAddProductModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                                {editingProductId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                            </h2>
                            <button onClick={() => setIsAddProductModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={24} /></button>
                        </div>

                        {/* Mock Form Fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Loại linh kiện</label>
                                <select
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                    value={newProduct.type}
                                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                                >
                                    <option value="cpu">Bộ vi xử lý (CPU)</option>
                                    <option value="mainboard">Bo mạch chủ (Mainboard)</option>
                                    <option value="vga">Chuyên xử lý đồ hoạ (VGA)</option>
                                    <option value="ram">Bộ nhớ trong (RAM)</option>
                                    <option value="storage">Ổ cứng (SSD/HDD)</option>
                                    <option value="psu">Nguồn (PSU)</option>
                                    <option value="cooling">Tản nhiệt (Cooling)</option>
                                    <option value="monitor">Màn hình Gaming</option>
                                    <option value="pc">PC Lắp ráp sẵn</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Tên sản phẩm</label>
                                <input
                                    placeholder="Nhập tên..."
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Ảnh Thumbnail (Trang Chủ)</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', flex: 1 }}
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            try {
                                                const compressedFile = await compressImage(file);
                                                const formData = new FormData();
                                                formData.append('image', compressedFile);
                                                const res = await api.post('/products/upload-image', formData);
                                                setNewProduct({ ...newProduct, thumbnailUrl: res.data.url });
                                            } catch (error) {
                                                console.error('Lỗi upload ảnh:', error);
                                                alert(error.response?.data || 'Không thể upload ảnh!');
                                            }
                                        }}
                                    />
                                    {newProduct.thumbnailUrl && (
                                        <img src={newProduct.thumbnailUrl.startsWith('http') || newProduct.thumbnailUrl.startsWith('data:image') ? newProduct.thumbnailUrl : `${API_URL}${newProduct.thumbnailUrl}`} alt="preview" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem'}} />
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Ảnh Chi Tiết Khác (Nhiều ảnh)</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        style={{ padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', flex: 1 }}
                                        onChange={async (e) => {
                                            const files = Array.from(e.target.files);
                                            if (files.length === 0) return;
                                            try {
                                                const uploadedUrls = await Promise.all(
                                                    files.map(async (file) => {
                                                        const compressedFile = await compressImage(file);
                                                        const formData = new FormData();
                                                        formData.append('image', compressedFile);
                                                        const res = await api.post('/products/upload-image', formData);
                                                        return res.data.url;
                                                    })
                                                );
                                                setNewProduct({ ...newProduct, detailImageUrls: [...newProduct.detailImageUrls, ...uploadedUrls] });
                                            } catch (error) {
                                                console.error('Lỗi upload ảnh chi tiết:', error);
                                                alert(error.response?.data || 'Có lỗi khi tải lên nhiều ảnh!');
                                            }
                                        }}
                                    />
                                    {newProduct.detailImageUrls && newProduct.detailImageUrls.map((url, index) => (
                                        <img key={index} src={`${API_URL}${url}`} alt="detail-preview" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem'}} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Thương hiệu (Brand)</label>
                                <input
                                    placeholder="Intel, AMD..."
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                    value={newProduct.brand}
                                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Giá gốc (VNĐ)</label>
                                <input
                                    type="number"
                                    placeholder="899000"
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                    value={newProduct.originalPrice}
                                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Giá khuyến mãi (Giá bán - VNĐ)</label>
                                <input
                                    type="number"
                                    placeholder="599000"
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #dc2626', borderRadius: '0.5rem', outline: 'none' }}
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Tồn kho</label>
                                <input
                                    type="number"
                                    placeholder="10"
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                    value={newProduct.stockQuantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* Special Fields (CPU) */}
                        {newProduct.type === 'cpu' && (
                            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e3a8a' }}>Thuộc tính riêng do bạn đã chọn: <b>CPU</b></h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Socket</label>
                                        <input
                                            placeholder="LGA 1700, AM5..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.socket}
                                            onChange={(e) => setNewProduct({ ...newProduct, socket: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Thế hệ</label>
                                        <input
                                            placeholder="Core i7 Thế hệ thứ 14..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.generation}
                                            onChange={(e) => setNewProduct({ ...newProduct, generation: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Tên thế hệ</label>
                                        <input
                                            placeholder="Raptor Lake..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.generationName}
                                            onChange={(e) => setNewProduct({ ...newProduct, generationName: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Số nhân</label>
                                        <input
                                            placeholder="20"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.cores}
                                            onChange={(e) => setNewProduct({ ...newProduct, cores: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Số luồng</label>
                                        <input
                                            placeholder="28"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.threads}
                                            onChange={(e) => setNewProduct({ ...newProduct, threads: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Nhịp cơ bản (Base Clock)</label>
                                        <input
                                            placeholder="3.5 GHz"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.baseClock}
                                            onChange={(e) => setNewProduct({ ...newProduct, baseClock: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Nhịp tối đa (Boost Clock)</label>
                                        <input
                                            placeholder="5.3 GHz"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.boostClock}
                                            onChange={(e) => setNewProduct({ ...newProduct, boostClock: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Bộ nhớ đệm (Cache)</label>
                                        <input
                                            placeholder="24MB L3 Cache"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.cache}
                                            onChange={(e) => setNewProduct({ ...newProduct, cache: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Công suất (TDP)</label>
                                        <textarea
                                            placeholder="Công suất cơ bản: 65W..."
                                            rows="2"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none', resize: 'vertical' }}
                                            value={newProduct.tdp}
                                            onChange={(e) => setNewProduct({ ...newProduct, tdp: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Hỗ trợ bộ nhớ</label>
                                        <textarea
                                            placeholder="DDR4 5600 MHz..."
                                            rows="2"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none', resize: 'vertical' }}
                                            value={newProduct.memorySupport}
                                            onChange={(e) => setNewProduct({ ...newProduct, memorySupport: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Số kênh bộ nhớ</label>
                                        <input
                                            placeholder="2"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.memoryChannels}
                                            onChange={(e) => setNewProduct({ ...newProduct, memoryChannels: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Phiên bản PCIe</label>
                                        <input
                                            placeholder="5.0 and 4.0"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.pcieVersion}
                                            onChange={(e) => setNewProduct({ ...newProduct, pcieVersion: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Số lane PCIe</label>
                                        <input
                                            placeholder="Up to 1x16+4..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.pcieLanes}
                                            onChange={(e) => setNewProduct({ ...newProduct, pcieLanes: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Tản nhiệt</label>
                                        <input
                                            placeholder="Mặc định đi kèm..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.cooling}
                                            onChange={(e) => setNewProduct({ ...newProduct, cooling: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {newProduct.type === 'vga' && (
                            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#166534' }}>Thuộc tính riêng do bạn đã chọn: <b>VGA (Card Đồ Họa)</b></h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Engine đồ họa</label>
                                        <input
                                            placeholder="GeForce RTX 3060..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.graphicEngine}
                                            onChange={(e) => setNewProduct({ ...newProduct, graphicEngine: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Chuẩn Bus</label>
                                        <input
                                            placeholder="PCI Express 4.0..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.busStandard}
                                            onChange={(e) => setNewProduct({ ...newProduct, busStandard: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Bộ nhớ (VRAM)</label>
                                        <input
                                            placeholder="12GB GDDR6..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.vram}
                                            onChange={(e) => setNewProduct({ ...newProduct, vram: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Engine Clock</label>
                                        <input
                                            placeholder="Base:1320Mhz; Boost:1777Mhz..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.engineClock}
                                            onChange={(e) => setNewProduct({ ...newProduct, engineClock: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Lõi CUDA</label>
                                        <input
                                            placeholder="3584..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.cudaCores}
                                            onChange={(e) => setNewProduct({ ...newProduct, cudaCores: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Clock bộ nhớ</label>
                                        <input
                                            placeholder="15Gbps..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.memoryClock}
                                            onChange={(e) => setNewProduct({ ...newProduct, memoryClock: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Giao diện bộ nhớ</label>
                                        <input
                                            placeholder="192 bit..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.memoryInterface}
                                            onChange={(e) => setNewProduct({ ...newProduct, memoryInterface: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Kết nối</label>
                                        <input
                                            placeholder="3DP+HDMI..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.ports}
                                            onChange={(e) => setNewProduct({ ...newProduct, ports: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Kích thước</label>
                                        <input
                                            placeholder="310*131.5*56mm..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.dimensions}
                                            onChange={(e) => setNewProduct({ ...newProduct, dimensions: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>PSU đề nghị</label>
                                        <input
                                            placeholder="550W trở lên..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.recommendedPsu}
                                            onChange={(e) => setNewProduct({ ...newProduct, recommendedPsu: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>Power Connectors</label>
                                        <input
                                            placeholder="8pin..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.powerConnectors}
                                            onChange={(e) => setNewProduct({ ...newProduct, powerConnectors: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>DirectX</label>
                                        <input
                                            placeholder="DirectX 12 Ultimate..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bbf7d0', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.directX}
                                            onChange={(e) => setNewProduct({ ...newProduct, directX: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {newProduct.type === 'ram' && (
                            <div style={{ backgroundColor: '#fdf4ff', border: '1px solid #fbcfe8', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#86198f' }}>Thuộc tính riêng do bạn đã chọn: <b>RAM</b></h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>Model RAM</label>
                                        <input
                                            placeholder="CMH96GX5M2E6000C36..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.ramModel}
                                            onChange={(e) => setNewProduct({ ...newProduct, ramModel: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>Loại RAM</label>
                                        <input
                                            placeholder="DDR5..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.ramType}
                                            onChange={(e) => setNewProduct({ ...newProduct, ramType: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>Dung lượng RAM</label>
                                        <input
                                            placeholder="96 GB (2 x 48GB)..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.capacity}
                                            onChange={(e) => setNewProduct({ ...newProduct, capacity: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>Tốc độ Bus RAM</label>
                                        <input
                                            placeholder="6000 MHz..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.busSpeed}
                                            onChange={(e) => setNewProduct({ ...newProduct, busSpeed: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>Overclock</label>
                                        <input
                                            placeholder="Intel XMP 3.0..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.overclock}
                                            onChange={(e) => setNewProduct({ ...newProduct, overclock: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>Đèn nền</label>
                                        <input
                                            placeholder="LED RGB..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.rgb}
                                            onChange={(e) => setNewProduct({ ...newProduct, rgb: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>Điện Áp</label>
                                        <input
                                            placeholder="1.4V..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.voltage}
                                            onChange={(e) => setNewProduct({ ...newProduct, voltage: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>CAS Latency</label>
                                        <input
                                            placeholder="CL 36-44-44-96..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.casLatency}
                                            onChange={(e) => setNewProduct({ ...newProduct, casLatency: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86198f' }}>Bảo hành</label>
                                        <input
                                            placeholder="36 tháng chính hãng..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fbcfe8', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.warranty}
                                            onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {newProduct.type === 'monitor' && (
                            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#c2410c' }}>Thuộc tính riêng do bạn đã chọn: <b>Màn Hình (Monitor)</b></h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#c2410c' }}>Kích thước</label>
                                        <input
                                            placeholder="27 inch..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fed7aa', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.screenSize}
                                            onChange={(e) => setNewProduct({ ...newProduct, screenSize: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#c2410c' }}>Độ phân giải</label>
                                        <input
                                            placeholder="2560 x 1440 (2K)..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fed7aa', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.resolution}
                                            onChange={(e) => setNewProduct({ ...newProduct, resolution: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#c2410c' }}>Tần số quét</label>
                                        <input
                                            placeholder="144Hz, 240Hz..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fed7aa', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.refreshRate}
                                            onChange={(e) => setNewProduct({ ...newProduct, refreshRate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {newProduct.type === 'mainboard' && (
                            <div style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#1f2937' }}>Thuộc tính riêng do bạn đã chọn: <b>Bo mạch chủ (Mainboard)</b></h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>Socket</label>
                                        <input
                                            placeholder="LGA 1700..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.socket}
                                            onChange={(e) => setNewProduct({ ...newProduct, socket: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>Kích Thước Mainboard</label>
                                        <input
                                            placeholder="m-ATX, ATX..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.mainboardSize}
                                            onChange={(e) => setNewProduct({ ...newProduct, mainboardSize: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>Khe Cắm Ram</label>
                                        <input
                                            placeholder="4 Khe Cắm..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.ramSlots}
                                            onChange={(e) => setNewProduct({ ...newProduct, ramSlots: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>CHIPSET</label>
                                        <input
                                            placeholder="Intel B760 (LGA 1700)..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.chipset}
                                            onChange={(e) => setNewProduct({ ...newProduct, chipset: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {newProduct.type === 'storage' && (
                            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#0369a1' }}>Thuộc tính riêng do bạn đã chọn: <b>Ổ cứng (SSD/HDD)</b></h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Loại ổ cứng</label>
                                        <input
                                            placeholder="SSD, HDD, SSD NVMe..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.driveType}
                                            onChange={(e) => setNewProduct({ ...newProduct, driveType: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Kết nối</label>
                                        <input
                                            placeholder="M2 PCIe, SATA 3..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.connection}
                                            onChange={(e) => setNewProduct({ ...newProduct, connection: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Dung lượng</label>
                                        <input
                                            placeholder="1TB, 512GB..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.storageCapacity}
                                            onChange={(e) => setNewProduct({ ...newProduct, storageCapacity: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Tốc độ đọc</label>
                                        <input
                                            placeholder="3500 MB/s..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.readSpeed}
                                            onChange={(e) => setNewProduct({ ...newProduct, readSpeed: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Tốc độ ghi</label>
                                        <input
                                            placeholder="2700 MB/s..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.writeSpeed}
                                            onChange={(e) => setNewProduct({ ...newProduct, writeSpeed: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Nhiệt độ hoạt động</label>
                                        <input
                                            placeholder="0 ~ 70°C..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.operatingTemp}
                                            onChange={(e) => setNewProduct({ ...newProduct, operatingTemp: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Hỗ trợ hệ điều hành</label>
                                        <input
                                            placeholder="Windows 7/8/10..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.osSupport}
                                            onChange={(e) => setNewProduct({ ...newProduct, osSupport: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>Tính năng khác</label>
                                        <textarea
                                            placeholder="Các tính năng nổi bật..."
                                            rows="3"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bae6fd', borderRadius: '0.5rem', outline: 'none', resize: 'vertical' }}
                                            value={newProduct.otherFeatures}
                                            onChange={(e) => setNewProduct({ ...newProduct, otherFeatures: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {newProduct.type === 'pc' && (
                            <div style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#7e22ce' }}>Thuộc tính riêng do bạn đã chọn: <b>PC Lắp ráp sẵn</b></h4>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>Vui lòng nhập tên/mã các linh kiện để cấu thành nên bộ PC này.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    {renderPcPartField('Vi xử lý (CPU)', 'pcCpu', 'cpu')}
                                    {renderPcPartField('Bo mạch chủ (Mainboard)', 'pcMainboard', 'mainboard')}
                                    {renderPcPartField('Bộ nhớ trong (RAM)', 'pcRam', 'ram')}
                                    {renderPcPartField('Card đồ họa (VGA)', 'pcVga', 'vga')}
                                    {renderPcPartField('Ổ cứng', 'pcStorage', 'storage')}
                                    {renderPcPartField('Nguồn (PSU)', 'pcPsu', 'psu')}
                                    {renderPcPartField('Vỏ Case', 'pcCase', 'case')}
                                </div>
                            </div>
                        )}

                        {newProduct.type === 'psu' && (
                            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#b45309' }}>Thuộc tính riêng do bạn đã chọn: <b>Nguồn (PSU)</b></h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309' }}>Công suất</label>
                                        <input
                                            placeholder="750W..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fcd34d', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.powerCapacity}
                                            onChange={(e) => setNewProduct({ ...newProduct, powerCapacity: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309' }}>Chuẩn hiệu suất</label>
                                        <input
                                            placeholder="80 Plus Gold..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fcd34d', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.efficiency}
                                            onChange={(e) => setNewProduct({ ...newProduct, efficiency: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309' }}>Kích thước (Form Factor)</label>
                                        <input
                                            placeholder="ATX, SFX..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fcd34d', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.formFactor}
                                            onChange={(e) => setNewProduct({ ...newProduct, formFactor: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309' }}>Kiểu cáp (Modular)</label>
                                        <input
                                            placeholder="Full Modular, Non-Modular..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fcd34d', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.modular}
                                            onChange={(e) => setNewProduct({ ...newProduct, modular: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309' }}>Nguồn điện đầu vào</label>
                                        <input
                                            placeholder="100-240V..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fcd34d', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.inputVoltage}
                                            onChange={(e) => setNewProduct({ ...newProduct, inputVoltage: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309' }}>Kích thước quạt</label>
                                        <input
                                            placeholder="120mm..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #fcd34d', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.psuFanSize}
                                            onChange={(e) => setNewProduct({ ...newProduct, psuFanSize: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {newProduct.type === 'cooling' && (
                            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#047857' }}>Thuộc tính riêng do bạn đã chọn: <b>Tản nhiệt (Cooling)</b></h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#047857' }}>Loại tản nhiệt</label>
                                        <input
                                            placeholder="Tản nhiệt khí, Tản AIO..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #6ee7b7', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.coolerType}
                                            onChange={(e) => setNewProduct({ ...newProduct, coolerType: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#047857' }}>Hỗ trợ Socket</label>
                                        <textarea
                                            placeholder="LGA 1700, AM5..."
                                            rows="2"
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #6ee7b7', borderRadius: '0.5rem', outline: 'none', resize: 'vertical' }}
                                            value={newProduct.supportedSockets}
                                            onChange={(e) => setNewProduct({ ...newProduct, supportedSockets: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#047857' }}>Tốc độ quạt</label>
                                        <input
                                            placeholder="500-1800 RPM..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #6ee7b7', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.fanSpeed}
                                            onChange={(e) => setNewProduct({ ...newProduct, fanSpeed: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#047857' }}>Lưu lượng gió (Airflow)</label>
                                        <input
                                            placeholder="65.4 CFM..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #6ee7b7', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.airflow}
                                            onChange={(e) => setNewProduct({ ...newProduct, airflow: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#047857' }}>Độ ồn</label>
                                        <input
                                            placeholder="25 dBA..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #6ee7b7', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.noiseLevel}
                                            onChange={(e) => setNewProduct({ ...newProduct, noiseLevel: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#047857' }}>Kích thước Radiator (AIO)</label>
                                        <input
                                            placeholder="360mm..."
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #6ee7b7', borderRadius: '0.5rem', outline: 'none' }}
                                            value={newProduct.radiatorSize}
                                            onChange={(e) => setNewProduct({ ...newProduct, radiatorSize: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <ComponentPickerModal
                            isOpen={pcPickerModalOpen}
                            onClose={() => setPcPickerModalOpen(false)}
                            activeSlot={pcActiveSlot}
                            allProducts={products}
                            onSelectProduct={handleSelectPcPart}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setIsAddProductModalOpen(false)} style={{ padding: '0.6rem 1.5rem', border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#4b5563', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                style={{ padding: '0.6rem 1.5rem', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Lưu Sản Phẩm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Order Details Modal --- */}
            {isOrderModalOpen && selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                                Chi Tiết Đơn Hàng #{selectedOrder.id}
                            </h2>
                            <button onClick={() => setIsOrderModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={24} /></button>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Thông Tin Khách Hàng</h3>
                                <p style={{ margin: '0.25rem 0', color: '#4b5563' }}><strong style={{ color: '#111827' }}>Tên:</strong> {selectedOrder.customerName}</p>
                                <p style={{ margin: '0.25rem 0', color: '#4b5563' }}><strong style={{ color: '#111827' }}>SĐT:</strong> {selectedOrder.phone}</p>
                                <p style={{ margin: '0.25rem 0', color: '#4b5563' }}><strong style={{ color: '#111827' }}>Email:</strong> {selectedOrder.email}</p>
                                <p style={{ margin: '0.25rem 0', color: '#4b5563' }}><strong style={{ color: '#111827' }}>Địa chỉ:</strong> {selectedOrder.address}</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Thông Tin Thanh Toán</h3>
                                <p style={{ margin: '0.25rem 0', color: '#4b5563' }}><strong style={{ color: '#111827' }}>Phương thức:</strong> {selectedOrder.paymentMethod}</p>
                                <p style={{ margin: '0.25rem 0', color: '#4b5563' }}><strong style={{ color: '#111827' }}>Trạng thái đơn:</strong> {selectedOrder.status}</p>
                                <p style={{ margin: '0.25rem 0', color: '#4b5563' }}><strong style={{ color: '#111827' }}>Ngày đặt:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>Sản Phẩm Đã Đặt</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Sản Phẩm</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Đơn Giá</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>SL</th>
                                        <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem', textAlign: 'right' }}>Thành Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.orderItems?.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>
                                                {item.product?.cpuName || item.product?.name || `Product ID: ${item.productId}`}
                                            </td>
                                            <td style={{ padding: '1rem', color: '#4b5563' }}>${item.unitPrice.toLocaleString()}</td>
                                            <td style={{ padding: '1rem', color: '#4b5563' }}>x{item.quantity}</td>
                                            <td style={{ padding: '1rem', color: '#059669', fontWeight: 600, textAlign: 'right' }}>
                                                ${(item.unitPrice * item.quantity).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '1rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginRight: '1rem' }}>Tổng Cộng:</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#dc2626' }}>${selectedOrder.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button onClick={() => setIsOrderModalOpen(false)} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#e5e7eb', color: '#374151', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
