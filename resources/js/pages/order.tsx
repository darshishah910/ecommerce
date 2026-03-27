import { useEffect, useState } from "react";
import axios from "../lib/axios";
import "../styles/style.css"

import Navbar from "../components/ecommerce/Navbar";
import Footer from "../components/ecommerce/Footer";


export default function Order() {
    const [orders, setOrders] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    // const fetchOrders = async () => {

    //     const res = await axios.get("/orders");
    //     setOrders(res.data);
    // };
    const updateStatus = async (orderId: number, status: string) => {
        try {
            await axios.put(`/orders/${orderId}/status`, { status });
            fetchOrders(); // refresh
        } catch (err) {
            console.error(err);
        }
    };
    const fetchOrders = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const url =
            user?.role === "admin" ? "/admin/orders" : "/orders";

        const res = await axios.get(url);
        setOrders(res.data);
    };

    const total_amount = orders.reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum: number, item: any) => {
            return itemSum + item.price * item.quantity;
        }, 0);
        return sum + orderTotal;
    }, 0);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchOrders();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>My Orders</h1>

            {orders.map((order) => (
                <div key={order.id} className="order-card">

                    {order.items.map((item: any) => (
                        <div key={item.id} className="order-item">
                            <h2>{item.product.name}</h2>
                            <p>Qty: {item.quantity}</p>
                            <p>Price: ₹{item.price}</p>
                        </div>
                    ))}
                    <div className="order-address">
                        <h4>Delivery Address</h4>
                        <p>{order.address?.name}</p>
                        <p>{order.address?.phone}</p>
                        <p>{order.address?.address}</p>
                        <p>
                            {order.address?.city}, {order.address?.state} -{" "}
                            {order.address?.pincode}
                        </p>
                    </div>


                    <div className="order-footer">
                        <span className={`status ${order.status}`}>
                            {order.status.toUpperCase()}
                        </span>

                        <span className="total">
                            ₹{order.total_amount}
                        </span>
                    </div>


                    {user?.role === "admin" && (
                        <select
                            value={order.status}
                            onChange={(e) =>
                                updateStatus(order.id, e.target.value)
                            }
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    )}

                </div>
            ))}

            <div>
                <span className="total-amount">
                    Total Amount: ₹{total_amount}
                </span>
            </div>
            <Footer />
        </div>
    );
}