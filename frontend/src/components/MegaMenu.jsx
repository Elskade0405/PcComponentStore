import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronRight } from 'lucide-react';
import './MegaMenu.css';

const menuData = [
  {
      id: 'pc-gaming',
      label: 'PC GAMING',
      columns: [
          { title: 'MÁY TÍNH CHƠI GAME', items: ['PC ĐẸP', 'PC GAMING GIÁ RẺ', 'PC GAMING TRUNG CẤP', 'PC GAMING CAO CẤP'] },
          { title: 'PC STREAM', items: [] },
          { title: 'THEO KHOẢNG GIÁ', items: ['Dưới 10 triệu', '10-15 triệu', '15-20 triệu', '20-25 triệu', '25-30 triệu', '30-40 triệu', '40-50 triệu', 'Trên 50 triệu'] },
          { title: 'FULL BỘ PC KÈM MÀN HÌNH', items: [] }
      ]
  },
  { 
      id: 'pc-workstation', 
      label: 'PC Workstation 2D 3D', 
      columns: [
          { title: 'PC VIDEO EDITING', items: ['PC RENDER'] },
          { title: 'PC PHOTO EDITING', items: ['PC Architecture - CAD'] },
          { title: 'PC 3D DESIGN - ANIMATION', items: ['PC MACHINE LEARNING/AI'] }
      ] 
  },
  { id: 'pc-office', label: 'PC VĂN PHÒNG', columns: [] },
  { id: 'pc-emulator', label: 'PC GIẢ LẬP', columns: [] },
  { 
      id: 'components', 
      label: 'LINH KIỆN MÁY TÍNH', 
      columns: [
          { 
              groups: [
                  { title: 'CPU', items: ['CPU INTEL', 'CPU AMD'] },
                  { title: 'GIÁ TREO MÀN HÌNH', items: [] },
                  { title: 'Vỏ Case', items: [] }
              ] 
          },
          { 
              groups: [
                  { title: 'Mainboard - Bo Mạch Chủ', items: ['Mainboard Cho CPU INTEL', 'Mainboard Cho CPU AMD'] },
                  { title: 'Ổ Cứng (SSD, HDD)', items: ['Ổ Cứng SSD', 'Ổ Cứng HDD'] },
                  { title: 'Nguồn (PSU)', items: [] }
              ] 
          },
          { 
              groups: [
                  { title: 'RAM', items: [] },
                  { title: 'VGA - Card Màn Hình', items: ['VGA NVIDIA', 'VGA AMD', 'VGA Nvidia RTX 5000 Series'] },
                  { title: 'Tản Nhiệt', items: ['Tản Nhiệt Khí', 'Tản Nhiệt Nước AIO', 'Quạt Tản Nhiệt'] }
              ] 
          }
      ] 
  },
  { id: 'monitor', label: 'MÀN HÌNH MÁY TÍNH', columns: [] },
  { id: 'accessories', label: 'PHỤ KIỆN', columns: [] },
  { id: 'onsale', label: 'OnSale', columns: [] },
];

const generateSlug = (text) => text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");

const MegaMenu = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(menuData[0].id);

  const activeCategory = menuData.find(c => c.id === activeCategoryId);

  return (
    <div className="mega-menu-wrapper">
      <button className="mega-menu-btn">
        <Menu size={18} />
        Danh mục sản phẩm
      </button>
      
      <div className="mega-menu-dropdown">
        <div className="mega-menu-sidebar">
          {menuData.map(category => (
            <div
              key={category.id}
              className={`mega-menu-category ${activeCategoryId === category.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveCategoryId(category.id)}
            >
              <span style={{ textTransform: 'uppercase' }}>{category.label}</span>
              <ChevronRight size={16} />
            </div>
          ))}
        </div>
        
        {activeCategory?.columns?.length > 0 ? (
          <div className="mega-menu-content">
            {activeCategory.columns.map((col, idx) => (
              <div key={idx} className="mega-menu-column">
                {col.groups ? (
                  col.groups.map((group, gIdx) => (
                    <div key={gIdx} className="mega-menu-group" style={{ marginBottom: '1.5rem' }}>
                      <Link 
                        to={`/collection/${generateSlug(group.title)}?title=${encodeURIComponent(group.title)}`} 
                        className="mega-menu-column-title" 
                        style={{ display: 'block', textDecoration: 'none' }}
                      >
                        {group.title}
                      </Link>
                      {group.items && group.items.length > 0 && (
                        <div className="mega-menu-column-list">
                          {group.items.map((item, i) => {
                            const targetUrl = `/collection/${generateSlug(item)}?title=${encodeURIComponent(item)}`;
                            return (
                              <Link key={i} to={targetUrl} className="mega-menu-column-item" style={{ textDecoration: 'none' }}>
                                {item}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="mega-menu-group">
                    <Link 
                      to={`/collection/${generateSlug(col.title)}?title=${encodeURIComponent(col.title)}`} 
                      className="mega-menu-column-title" 
                      style={{ display: 'block', textDecoration: 'none' }}
                    >
                      {col.title}
                    </Link>
                    {col.items && col.items.length > 0 && (
                      <div className="mega-menu-column-list">
                        {col.items.map((item, i) => {
                          const targetUrl = `/collection/${generateSlug(item)}?title=${encodeURIComponent(item)}`;
                          return (
                            <Link key={i} to={targetUrl} className="mega-menu-column-item" style={{ textDecoration: 'none' }}>
                              {item}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mega-menu-content"></div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
