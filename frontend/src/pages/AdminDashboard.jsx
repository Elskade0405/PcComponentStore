import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, Edit, Trash2, Plus, LayoutDashboard, Users, Tags, X } from 'lucide-react';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // Default to products for easier testing
    const [loading, setLoading] = useState(true);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

    // Form state for new products
    const [newProduct, setNewProduct] = useState({
        type: 'cpu',
        name: '',
        brand: '',
        price: 0,
        stockQuantity: 0,
        socket: '',
        cores: '',
        baseClock: '',
        boostClock: '',
        cache: '',
        tdp: ''
    });

    const { user } = useAuth();

    useEffect(() => {
        fetchAdminData();
    }, [activeTab]);

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
            } else if (activeTab === 'categories') {
                const res = await api.get('/categories');
                setCategories(res.data);
            }
        } catch (error) {
            console.error(`Failed to fetch ${activeTab} data:`, error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
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

    const handleAddProduct = async () => {
        try {
            await api.post('/products', newProduct);
            alert('Thêm sản phẩm thành công!');
            setIsAddProductModalOpen(false);
            setNewProduct({ type: 'cpu', name: '', brand: '', price: 0, stockQuantity: 0, socket: '', cores: '', baseClock: '', boostClock: '', cache: '', tdp: '' });
            fetchAdminData();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            alert('Có lỗi xảy ra khi thêm sản phẩm vào DB.');
        }
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

    const navItems = [
        { id: 'dashboard', label: 'Tóm tắt', icon: LayoutDashboard },
        { id: 'orders', label: 'Đơn hàng', icon: Package },
        { id: 'products', label: 'Sản phẩm', icon: Truck },
        { id: 'categories', label: 'Danh mục', icon: Tags },
        { id: 'users', label: 'Khách hàng', icon: Users },
    ];

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
                                                <select
                                                    style={{ padding: '0.35rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', outline: 'none' }}
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                >
                                                    <option value="Pending">Chờ xử lý</option>
                                                    <option value="Processing">Đang xuất kho</option>
                                                    <option value="Shipped">Đang giao</option>
                                                    <option value="Delivered">Đã giao</option>
                                                    <option value="Cancelled">Đã hủy</option>
                                                </select>
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                            <button 
                                onClick={() => setIsAddProductModalOpen(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
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
                                    ) : products.map(product => (
                                        <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>{product.id}</td>
                                            <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>{product.name}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 500 }}>
                                                    {product.categoryName || 'Máy Bàn'}
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
                                                    <button style={{ padding: '0.4rem', color: '#4b5563', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: 'pointer' }}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => deleteProduct(product.id)} style={{ padding: '0.4rem', color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', cursor: 'pointer' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && !loading && (
                                        <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Chưa có sản phẩm nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- Placeholders for other tabs --- */}
                {(activeTab === 'dashboard' || activeTab === 'categories' || activeTab === 'users') && (
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
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Thêm Sản Phẩm Động (Kế thừa)</h2>
                            <button onClick={() => setIsAddProductModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={24} /></button>
                        </div>
                        
                        <div style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            <p><strong>Lưu ý:</strong> Cơ sở dữ liệu của chúng ta sử dụng kiến trúc phân cấp (Table-Per-Hierarchy).</p>
                            <p>Khi API Backend hoàn thiện, Form này sẽ cho phép bạn chọn Loại Linh Kiện (VD: CPU, RAM), sau đó sẽ tự động mọc thêm các ô input chuyên biệt (như Socket, Speed, Capacity) thay vì chỉ có Name và Price cơ bản.</p>
                        </div>
                        
                        {/* Mock Form Fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Loại linh kiện</label>
                                <select 
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                                    value={newProduct.type}
                                    onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                                >
                                    <option value="cpu">Bộ vi xử lý (CPU)</option>
                                    <option value="mainboard" disabled>Bo mạch chủ (Mainboard) - Coming soon</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Tên sản phẩm</label>
                                <input 
                                    placeholder="Nhập tên..." 
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }} 
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Thương hiệu (Brand)</label>
                                <input 
                                    placeholder="Intel, AMD..." 
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }} 
                                    value={newProduct.brand}
                                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Giá bán (VNĐ)</label>
                                <input 
                                    type="number" 
                                    placeholder="599000" 
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }} 
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Tồn kho</label>
                                <input 
                                    type="number" 
                                    placeholder="10" 
                                    style={{ padding: '0.6rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }} 
                                    value={newProduct.stockQuantity}
                                    onChange={(e) => setNewProduct({...newProduct, stockQuantity: Number(e.target.value)})}
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
                                            onChange={(e) => setNewProduct({...newProduct, socket: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Số nhân / Số luồng</label>
                                        <input 
                                            placeholder="14 Cores / 20 Threads" 
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }} 
                                            value={newProduct.cores}
                                            onChange={(e) => setNewProduct({...newProduct, cores: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Nhịp cơ bản (Base Clock)</label>
                                        <input 
                                            placeholder="3.5 GHz" 
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }} 
                                            value={newProduct.baseClock}
                                            onChange={(e) => setNewProduct({...newProduct, baseClock: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Nhịp tối đa (Boost Clock)</label>
                                        <input 
                                            placeholder="5.3 GHz" 
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }} 
                                            value={newProduct.boostClock}
                                            onChange={(e) => setNewProduct({...newProduct, boostClock: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Bộ nhớ đệm (Cache)</label>
                                        <input 
                                            placeholder="24MB L3 Cache" 
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }} 
                                            value={newProduct.cache}
                                            onChange={(e) => setNewProduct({...newProduct, cache: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e3a8a' }}>Công suất (TDP)</label>
                                        <input 
                                            placeholder="125W" 
                                            style={{ padding: '0.6rem 1rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem', outline: 'none' }} 
                                            value={newProduct.tdp}
                                            onChange={(e) => setNewProduct({...newProduct, tdp: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setIsAddProductModalOpen(false)} style={{ padding: '0.6rem 1.5rem', border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#4b5563', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                                Hủy
                            </button>
                            <button 
                                onClick={handleAddProduct}
                                style={{ padding: '0.6rem 1.5rem', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Lưu Sản Phẩm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
