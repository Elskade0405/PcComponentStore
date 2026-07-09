import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const cartKey = user?.email ? `cart_${user.email}` : 'cart_guest';

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                setCart([]);
            }
        } else {
            setCart([]);
        }
    }, [cartKey]);

    const saveCart = (newCart) => {
        localStorage.setItem(cartKey, JSON.stringify(newCart));
        return newCart;
    };

    const addToCart = (product, quantity = 1) => {
        if (!user) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng và thanh toán!');
            window.location.href = '/login';
            return;
        }
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return saveCart(prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                ));
            }
            return saveCart([...prevCart, { ...product, quantity }]);
        });
    };

    const updateQuantity = (id, detailQuantity) => {
        setCart(prevCart => {
            if (detailQuantity < 1) return prevCart;
            return saveCart(prevCart.map(item =>
                item.id === id ? { ...item, quantity: detailQuantity } : item
            ));
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => saveCart(prevCart.filter(item => item.id !== id)));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.setItem(cartKey, JSON.stringify([]));
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
