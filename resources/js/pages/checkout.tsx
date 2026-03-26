import { useEffect, useState } from "react";
import axios from "../lib/axios";
import Navbar from "../components/ecommerce/Navbar";
import Footer from "../components/ecommerce/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function Checkout() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [user, setUser] = useState<any>(null); // ✅ ADD

    const token = localStorage.getItem("token");

    const fetchAddress = async () => {
        const res = await axios.get("/address", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data);
    };

    useEffect(() => {
        // ✅ GET USER
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchAddress();
    }, []);

    const placeOrder = async () => {
        if (!selected) {
            toast.error("Select address");
            return;
        }

        try {
            await axios.post("/orders/place",
                { address_id: selected },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success("Order placed!");

            setTimeout(() => {
                window.location.href = "/orders";
            }, 1000);

        } catch {
            toast.error("Order failed");
        }
    };

    return (
        <>
            <Toaster />
            <Navbar user={user} cartCount={0} /> {/* ✅ FIX */}

            <div className="checkout-container">
                <h2>Select Address</h2>

                {addresses.map((a) => (
                    <div key={a.id} className="address-card">
                        <input
                            type="radio"
                            name="address"
                            onChange={() => setSelected(a.id)}
                        />
                        <p>{a.address}, {a.city}</p>
                    </div>
                ))}

                <button onClick={placeOrder} className="order-btn">
                    Confirm Order
                </button>
            </div>

            <Footer />
        </>
    );
}
