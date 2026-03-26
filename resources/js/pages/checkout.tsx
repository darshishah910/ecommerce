import { useState } from "react";
import axios from "../lib/axios";
import Navbar from "../components/ecommerce/Navbar";
import Footer from "../components/ecommerce/Footer";

export default function Checkout({ addresses }: any) {
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

    const token = localStorage.getItem("token");

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert("Please select address");
            return;
        }

        try {
            await axios.post(
                "/orders",
                { address_id: selectedAddress },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Order placed successfully!");
            window.location.href = "/";

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />

            <div className="checkout-container">
                <h2>Select Address</h2>

                {addresses.length === 0 && (
                    <p>No address found. Please add one.</p>
                )}

                {addresses.map((a: any) => (
                    <div key={a.id} className="address-card">
                        <input
                            type="radio"
                            name="address"
                            value={a.id}
                            onChange={() => setSelectedAddress(a.id)}
                        />

                        <div>
                            <h4>{a.name}</h4>
                            <p>{a.phone}</p>
                            <p>{a.address}</p>
                            <p>{a.city}, {a.state} - {a.pincode}</p>
                        </div>
                    </div>
                ))}

                <button onClick={handlePlaceOrder}>
                    Place Order
                </button>
            </div>

            <Footer />
        </>
    );
}