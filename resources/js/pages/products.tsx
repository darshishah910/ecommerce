import { useEffect, useState } from "react";
import axios from "../lib/axios";
import "../styles/style.css";
import { toast, Toaster } from "react-hot-toast";
import { validateProduct } from "../validations/productValidation";

import Navbar from "../components/ecommerce/Navbar";
import Footer from "../components/ecommerce/Footer";

type ProductForm = {
    name: string;
    description: string;
    price: string;
    image: File | null;
    stock: number;
};

export default function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    const isAdmin = user?.role === "admin";

    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        price: "",
        image: null,
        stock: 1
    });

    const [editId, setEditId] = useState<number | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>({});

    const [cartCount, setCartCount] = useState(0);

    const fetchProducts = async () => {
        const params: any = { page };

        if (search) {
            params.search = search;
        }

        const res = await axios.get("/products", { params });

        setProducts(res.data.data);
        setPagination(res.data);
    };

    useEffect(() => {
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        let guestId = localStorage.getItem("guest_id");
        if (!guestId) {
            guestId = "guest_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("guest_id", guestId);
        }

        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(storedCart.length);

        fetchProducts();
    }, [search, page]);

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            setForm({ ...form, image: files[0] });
        } else if (name === "stock") {
            setForm({ ...form, stock: parseInt(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async () => {
        if (loading) return;

        const validationErrors = validateProduct(form, !!editId);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();
            Object.keys(form).forEach((key: any) => {
                const value = (form as any)[key];
                if (value !== null) data.append(key, value);
            });

            if (editId) {
                data.append("_method", "PUT");
                await axios.post(`/products/${editId}`, data);
                toast.success("Updated");
            } else {
                await axios.post("/products", data);
                toast.success("Created");
            }

            setForm({
                name: "",
                description: "",
                price: "",
                image: null,
                stock: 1
            });

            setEditId(null);
            fetchProducts();

        } catch {
            toast.error("Error");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (p: any) => {
        setForm({
            name: p.name,
            description: p.description,
            price: String(p.price),
            image: p.image,
            stock: p.stock
        });

        setEditId(p.id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;

        await axios.delete(`/products/${id}`);
        toast.success("Deleted");
        fetchProducts();
    };

    const handleAddToCart = async (product: any) => {
    try {
        let guestId = localStorage.getItem("guest_id");

        if (!guestId) {
            guestId = "guest_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("guest_id", guestId);
        }

        const token = localStorage.getItem("token");

        await axios.post(
            "/cart/add",
            {
                product_id: product.id,
                quantity: 1,
                guest_id: guestId
            },
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {}
            }
        );

        
        window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
        console.error(err);
    }
};

    return (
        <>
            <Toaster />

            <Navbar user={user} cartCount={cartCount} />

            <div className="main-content">
                <div className="product-container">

                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="search-input"
                    />

                    {isAdmin && (
                        <div className="product-form">
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                            <input type="file" name="image" onChange={handleChange} />
                             <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />

                            <select name="stock" value={form.stock} onChange={handleChange}>
                                <option value={1}>In Stock</option>
                                <option value={0}>Out of Stock</option>
                            </select>

                            <button onClick={handleSubmit}>
                                {editId ? "Update" : "Create"}
                            </button>
                        </div>
                    )}

                    <div className="product-grid">
                        {products.map((p) => (
                            <div className="product-card" key={p.id}>

                                <img
                                    src={p.image}
                                    className="card-img"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://via.placeholder.com/200";
                                    }}
                                />

                                <h3>{p.name}</h3>
                                <p className="">{p.description}</p>
                                <p className="price">₹{p.price}</p>
                                <p className="stock">{p.stock}</p>

                                <div className="card-actions">
                                    {!isAdmin &&  (
                                    <button
                                        className="btn-cart"
                                        onClick={() => handleAddToCart(p)}
                                    >
                                        Add to Cart
                                    </button>
                                    )}

                                    {isAdmin && (
                                        <>
                                            <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                                            <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                                        </>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            disabled={pagination.current_page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </button>

                        <span>
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>

                        <button
                            disabled={pagination.current_page === pagination.last_page}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}