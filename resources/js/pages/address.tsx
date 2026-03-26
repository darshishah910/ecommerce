import { useEffect, useState } from "react";
import axios from "../lib/axios";
import Navbar from "../components/ecommerce/Navbar";
import Footer from "../components/ecommerce/Footer";
import "../styles/style.css";
import toast, { Toaster } from "react-hot-toast";

export default function Address() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null); // ✅ ADD

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const token = localStorage.getItem("token");

    const fetchAddress = async () => {
        try {
            const res = await axios.get("/address", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // ✅ GET USER
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchAddress();
    }, []);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await axios.post("/address", form, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Address Added");

            setForm({
                name: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                pincode: ""
            });

            fetchAddress();
        } catch {
            toast.error("Error adding address");
        }
    };

    return (
        <>
            <Toaster />
            <Navbar user={user} cartCount={0} /> {/* ✅ FIX */}

            <div className="address-container">
                <h2>My Addresses</h2>

                <form onSubmit={handleSubmit} className="address-form">
                    <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                    <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
                    <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
                    <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
                    <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
                    <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />

                    <button type="submit">Add Address</button>
                </form>

                <div className="address-list">
                    {addresses.map((a) => (
                        <div key={a.id} className="address-card">
                            <h4>{a.name}</h4>
                            <p>{a.address}, {a.city}</p>
                            <p>{a.state} - {a.pincode}</p>
                            <p>{a.phone}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}
