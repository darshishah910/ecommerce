import { useEffect, useState } from "react";
import axios from "../lib/axios";
import "../styles/style.css"

interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export default function Address() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [form, setForm] = useState<any>({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [editId, setEditId] = useState<number | null>(null);
    const [errors, setErrors] = useState<any>({});

    const token = localStorage.getItem("token");

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

 
    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            setErrors({});

            if (editId) {
                await axios.put(`/addresses/${editId}`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert("Address updated");
            } else {
                await axios.post("/addresses", form, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert("Address added");
            }

          
            setForm({
                name: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                pincode: ""
            });

            setEditId(null);
            fetchAddresses();

        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        }
    };
    const handleEdit = (a: Address) => {
        setForm(a);
        setEditId(a.id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this address?")) return;

        await axios.delete(`/addresses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        fetchAddresses();
    };

    return (
        <div className="address-container">
            <h2>Manage Address</h2>

            <div className="address-form">
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                <p className="error">{errors.name?.[0]}</p>

                <input type="number" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
                <p className="error">{errors.phone?.[0]}</p>

                <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
                <p className="error">{errors.address?.[0]}</p>

                <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
                <p className="error">{errors.city?.[0]}</p>

                <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
                <p className="error">{errors.state?.[0]}</p>

                <input type="number" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
                <p className="error">{errors.pincode?.[0]}</p>

                <button onClick={handleSubmit}>
                    {editId ? "Update Address" : "Add Address"}
                </button>
            </div>

            <div className="address-list">
                {addresses.length === 0 && <p>No address found</p>}

                {addresses.map((a) => (
                    <div key={a.id} className="address-card">
                        <h4>{a.name}</h4>
                        <p>{a.phone}</p>
                        <p>{a.address}</p>
                        <p>{a.city}, {a.state} - {a.pincode}</p>

                        <button onClick={() => handleEdit(a)}>Edit</button>
                        <button onClick={() => handleDelete(a.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
