
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/OrderHeader.jsx";
import LandingPage from "../components/LandingPage.jsx";
import DashBoard from "./DashBoard.jsx";
import Cart from "../components/Cart.jsx"; // Import Cart component
import OrderFooter from "../components/OrderFooter.jsx";
import Login from "../components/Login.jsx";

export default function Order() {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false); // State for cart visibility

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingProduct = prevItems.find(item => item.id === product.id);
            if (existingProduct) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity: product.quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const toggleCart = () => {
        setIsCartOpen(prev => !prev); // Toggle cart visibility
    };

    return (
        <>
            <Header toggleCart={toggleCart} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />

            <Routes>
                <Route
                    path="/"
                    element={<LandingPage addToCart={addToCart} />}
                />
                <Route path="/login" element={<Login />} />

                <Route path="/account/*" element={<DashBoard />} />
            </Routes>

            {/* Conditional rendering of Cart */}
            {isCartOpen && <Cart cartItems={cartItems} removeFromCart={removeFromCart} toggleCart={toggleCart} addToCart={addToCart} />}
            <OrderFooter />

        </>
    );
}