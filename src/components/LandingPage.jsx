import React, { useState, useEffect } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import pc30 from "../assets/Images/30pc.svg";
import pc12 from "../assets/Images/12pc.svg";
import pc6 from "../assets/Images/6pc.svg";
import ellipse7 from "../assets/Images/Ellipse 7 carousel_bg.svg";
import ellipse8 from "../assets/Images/Ellipse 8 carousel_bg.svg";
import bg from "../assets/Images/hero-section-carousel-bg.svg";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, decrementItem } from "../redux/localStorageSlice";

const imageMapping = {
  "6pc_tray": pc6,
  "12pc_tray": pc12,
  "30pc_tray": pc30,
};

const LandingPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.localStorage.items);

  const [popupVisible, setPopupVisible] = useState(false);
  const [products, setProducts] = useState([]);

  const handleIncrement = (product) => {
    dispatch(addItem(product));
  };

  const handleDecrement = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item.quantity > 1) {
      dispatch(decrementItem(productId));
    } else {
      dispatch(removeItem(productId));
    }
  };

  const handleAddToCart = (product) => {
    if (product.countInStock === 0) {
      alert("This item is currently out of stock.");
      return;
    }

    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      dispatch(
        addItem({ ...existingProduct, quantity: existingProduct.quantity + 1 })
      );
    } else {
      dispatch(addItem({ ...product, quantity: 1 }));
    }
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 1000);
  };

  const getProductQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://b2c-backend-1.onrender.com/api/v1/admin/getallproducts"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedProducts = await response.json();
        const mappedProducts = fetchedProducts.map((product) => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          discount: product.discount,
          originalPrice: parseFloat(product.currentPrice),
          image: imageMapping[product.name] || pc6, // Default to pc6 if no match
          countInStock: product.countInStock || 0, // Ensure countInStock is included
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen font-poppins mt-12 relative">
      {popupVisible && (
        <div className="fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md shadow-md z-50 transition-opacity duration-500">
          Product added to cart!
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div
          className="mb-12 relative bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="flex flex-col-reverse md:flex-row justify-between items-center">
            <div className="md:w-1/2 text-center md:text-left">
              <p className="text-lg font-semibold text-orange-600">
                Egg Bucket Collection
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Farm Fresh Eggs
                <br /> Directly To Your <br />
                Table
              </h2>
              <p className="mt-4 text-black font-semibold">
                Subscribe Now For Daily And Weekly Delivery
              </p>
            </div>

            <div className="w-1/2 flex justify-center items-center relative h-72 md:h-96">
              <img
                src={ellipse7}
                alt="Ellipse 7"
                className="w-full md:w-3/4 absolute z-10 mt-14 animate-spin-slow"
              />
              <img
                src={ellipse8}
                alt="Ellipse 8"
                className="w-4/5 md:w-3/5 absolute z-20 mt-14 animate-spin-slow"
              />
              <img
                src={pc30}
                alt="30 pc tray"
                className="w-3/4 md:w-2/4 absolute z-30 mt-14"
              />
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-bold mb-8 text-center md:text-left">
          Our Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-black transition-transform duration-300 hover:scale-105"
            >
              <div className="flex flex-col md:flex-row p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full md:w-1/2 h-36 object-contain mb-4"
                />
                <div className="w-full md:w-1/2 pl-4">
                  <span className="text-2xl font-bold text-blue-900 mt-4 block">
                    ₹ {product.price.toFixed(2)}
                  </span>
                  <span className="text-md text-gray-500 line-through mt-2 block">
                    ₹ {product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 mt-1">
                    {product.discount}% OFF`
                  </span>
                </div>
              </div>
              <div className="flex flex-col bg-gradient-to-r from-yellow-300 to-orange-300 p-4 rounded-2xl">
                <h4 className="text-lg font-bold text-center">
                  {product.name}
                </h4>
                {product.countInStock === 0 ? (
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-md mt-4 w-full cursor-not-allowed"
                    disabled
                  >
                    Out of Stock
                  </button>
                ) : getProductQuantity(product.id) > 0 ? (
                  <div className="flex items-center justify-between mt-4">
                    <button
                      className="bg-gray-200 p-2 rounded-md"
                      onClick={() => handleDecrement(product.id)}
                    >
                      <Minus size={16} />
                    </button>

                    <span className="text-lg font-semibold">
                      {getProductQuantity(product.id)}
                    </span>

                    <button
                      className="bg-gray-200 p-2 rounded-md"
                      onClick={() => handleIncrement(product)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4 w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
