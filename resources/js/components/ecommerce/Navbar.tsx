import { useEffect, useState } from "react";

export default function Navbar({ cartCount }: any) {
    const [user, setUser] = useState<any>(null);
    const isAdmin = user?.role === "admin";


    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const handleCartClick = () => {
        console.log("cart")
    }

    return (
        <div className="navbar">
            <h2 className="logo">MyShop</h2>

            <div className="nav-right">

                {!user ? (
                    <>
                        <a href="/login">Login</a>
                        <a href="/register">Signup</a>
                    </>
                ) : (
                    <>
                        <span>Hello, {user.name}</span>
                        {isAdmin && (
                            <div>
                                <a href="/orders">Orders</a>
                            </div>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}

                {!isAdmin && (
                    <div className="cart-icon" onClick={handleCartClick}>
                        <a href="/cart">🛒 <span>{cartCount}</span></a>
                    </div>
                )}



            </div>
        </div>
    );
}