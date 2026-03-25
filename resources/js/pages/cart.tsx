import { useEffect, useState } from "react";
import axios from "../lib/axios";
import Navbar from "../components/ecommerce/Navbar";
import Footer from "../components/ecommerce/Footer";
import "../styles/style.css"

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface CartItem {
    id: number;
    quantity: number;
    product: Product;
}

interface CartType {
    items: CartItem[];
}

export default function Cart() {
    const [cart, setCart] = useState<CartType | null>(null);
    const [loading, setLoading] = useState(true);

    const guestId = localStorage.getItem("guest_id");
    const token = localStorage.getItem("token");

    const fetchCart = async () => {
        try {
            setLoading(true);

            const res = await axios.get("/cart", {
                params: { guest_id: guestId }
                // headers: token
                //     ? { Authorization: `Bearer ${token}` }
                //     : {}
            });

            setCart(res.data);

        } catch (err) {
            console.error("Cart fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQty = async (id: number, qty: number) => {
        if (qty < 1) return;

        try {
            await axios.put(`/cart/${id}`, {
                quantity: qty,
                guest_id: guestId
            });

            fetchCart();
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    const removeItem = async (id: number) => {
        try {
            await axios.delete(`/cart/${id}`, {
                data: { guest_id: guestId }
            });

            fetchCart();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const removemultiItem = async () => {
        try {
            await axios.delete(`/cart/delete`, {
                data: { guest_id: guestId }
            });

            fetchCart();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const total =
        cart?.items?.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        ) || 0;

    const handleOrder = async () => {
        if (!token) {
            alert("Please login first");
            window.location.href = "/login";
            return;
        }

        try {
            // await axios.post("/checkout",
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`
            //         }
            //     }
            // );

            window.location.href = "/checkout";

            // alert("Order placed successfully!");
            // fetchCart();

        } catch (err) {
            console.error("Order error:", err);
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading cart...</p>;
    }

    if (!cart || cart.items.length === 0) {
        return <p className="text-center mt-10">Your cart is empty</p>;
    }

    return (

        <div className="cart-container">
            <Navbar />
            <h2>Your Cart</h2>

            {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                    <img src={item.product.image} width={80} />

                    <div>
                        <h4>{item.product.name}</h4>
                        <p>₹{item.product.price}</p>

                        <div className="qty-controls">
                            <button
                                onClick={() =>
                                    updateQty(item.id, item.quantity - 1)
                                }
                            >
                                -
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                onClick={() =>
                                    updateQty(item.id, item.quantity + 1)
                                }
                            >
                                +
                            </button>
                        </div>

                        <button
                            className="remove-btn"
                            onClick={() => removeItem(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <h3>Total: ₹{total}</h3>

            <button
                className="remove-btn"
                onClick={() => removemultiItem()}
            >
                Remove
            </button>

            <button className="order-btn" onClick={handleOrder}>
                Place Order
            </button>

            <Footer />
        </div>
    );
}