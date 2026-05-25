import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Loader2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Chào bạn! Mình là Trợ lý AI của cửa hàng. Bạn cần tìm mua linh kiện, laptop hay tư vấn Build PC ạ?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const { user } = useAuth(); // Import useAuth to get user
    const { addToCart } = useCart();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        try {
            const payload = { message: userMsg };
            if (user && user.userId) {
                payload.userId = user.userId;
            }
            const res = await api.post('/chatbot/ask', payload);
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply, buildItems: res.data.buildItems }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: 'Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau!' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
            {/* Chat Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-blue)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 113, 227, 0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s',
                        ':hover': { transform: 'scale(1.05)' }
                    }}
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--accent-blue)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={20} />
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>AI Trợ lý ảo</span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        backgroundColor: '#f9fafb'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ 
                                display: 'flex', 
                                gap: '0.5rem',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                            }}>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', 
                                    backgroundColor: msg.role === 'user' ? '#e5e7eb' : '#e0e7ff',
                                    color: msg.role === 'user' ? '#6b7280' : '#4f46e5',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                                </div>
                                <div style={{
                                    backgroundColor: msg.role === 'user' ? 'var(--accent-blue)' : 'white',
                                    color: msg.role === 'user' ? 'white' : '#374151',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '16px',
                                    borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                                    borderTopLeftRadius: msg.role === 'bot' ? '4px' : '16px',
                                    maxWidth: '80%',
                                    fontSize: '0.9rem',
                                    boxShadow: msg.role === 'bot' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                    border: msg.role === 'bot' ? '1px solid #f3f4f6' : 'none',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {msg.text}
                                    {msg.buildItems && msg.buildItems.length > 0 && (
                                        <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {msg.buildItems.map((item, idx) => (
                                                    <div key={idx} 
                                                         onClick={() => {
                                                             setIsOpen(false);
                                                             navigate(`/product/${item.id}`);
                                                         }}
                                                         style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '8px', border: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                                         onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                                         onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                    >
                                                        <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--accent-blue)' }}>{item.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.categoryName?.toUpperCase()}</div>
                                                        </div>
                                                        <div style={{ fontWeight: 600, color: '#ef4444', fontSize: '0.85rem', flexShrink: 0 }}>
                                                            {item.price?.toLocaleString()}đ
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    msg.buildItems.forEach(item => addToCart(item));
                                                    alert('Đã thêm toàn bộ cấu hình vào giỏ hàng!');
                                                }}
                                                style={{
                                                    marginTop: '1rem', width: '100%', padding: '0.75rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                                            >
                                                <ShoppingCart size={18} /> Thêm vào giỏ hàng
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={18} />
                                </div>
                                <div style={{ backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: '16px', borderTopLeftRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #f3f4f6' }}>
                                    <Loader2 size={16} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Đang tìm kiếm...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} style={{
                        padding: '1rem',
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nhập yêu cầu của bạn..."
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                borderRadius: '9999px',
                                border: '1px solid #d1d5db',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: !inputValue.trim() || isTyping ? '#e5e7eb' : 'var(--accent-blue)',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: !inputValue.trim() || isTyping ? 'not-allowed' : 'pointer',
                                flexShrink: 0
                            }}
                        >
                            <Send size={18} style={{ marginLeft: '2px' }} />
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
