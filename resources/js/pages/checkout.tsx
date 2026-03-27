import { useState , useEffect } from "react";
import axios from "../lib/axios";
import Navbar from "../components/ecommerce/Navbar";
import Footer from "../components/ecommerce/Footer";
import "../styles/style.css"
import Cart from "./cart";

interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

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

export default function Checkout() {
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);


    const token = localStorage.getItem("token");

    const addaddress = async () => {
        try {
            window.location.href = "/addresses";
        } catch (err) {
            console.error(err);

        }
    };

    const fetchAddresses = async () => {
        try {
            const res = await axios.get("/addresses", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAddresses(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);


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
            <Cart />

            <div className="checkout-container">
                <h2>Select Address</h2>

                <button onClick={addaddress}>+ Add Address</button>

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