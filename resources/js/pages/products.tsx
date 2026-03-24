import { useEffect, useState } from "react";
import axios from "../lib/axios";
import "../styles/style.css";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import { validateProduct } from "../validations/productValidation";

type ProductForm = {
    name: string;
    description: string;
    price: string;
    image: File | null;
    stock: number;
};

export default function Products() {
    const [products, setProducts] = useState<any[]>([]);
    // const [user, setUser] = useState<any>(null);

    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        price: "",
        image: null,
        stock: 1
    });

    // const isAdmin = user?.role === "admin";

    const [editId, setEditId] = useState<number | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);


    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>({});

    // const fetchUser = async () => {
    //     const res = await axios.get("/user");
    //     setUser(res.data.user);
    // };

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
        const token = localStorage.getItem("token");

        // if (!token) {
        //     window.location.href = "/login";
        //     return;
        // }

        // fetchUser();
        fetchProducts();
    }, [search, page]);

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files[0];
            setForm({ ...form, image: file });

            if (file) {
                setPreviewImage(URL.createObjectURL(file));
            }
        } else if (name === "stock") {
            setForm({ ...form, stock: parseInt(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async () => {
        if (loading) return;
        // console.log("erwrff")

        const validationErrors = validateProduct(form, !!editId);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log(validationErrors)
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();
            (Object.keys(form) as (keyof typeof form)[]).forEach((key) => {
                const value = form[key];
                if (value === null) return;

                if (value instanceof File) {
                    data.append(key, value);
                } else {
                    data.append(key, String(value));
                }
            });

            if (editId) {
                data.append("_method", "PUT");
                await axios.post(`/products/${editId}`, data);
                toast.success("Product updated");
            } else {
                await axios.post("/products", data);
                toast.success("Product created");
            }

            setForm({
                name: "",
                description: "",
                price: "",
                image: null,
                stock: 1
            });

            setEditId(null);
            setErrors({});
            fetchProducts();

        } catch (error: any) {
            toast.error("Error occurred");
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (p: any) => {
        setForm({
            name: p.name,
            description: p.description,
            price: String(p.price),
            image: null,
            stock: p.stock
        });

        setPreviewImage(p.image);
        setEditId(p.id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;

        await axios.delete(`/products/${id}`);
        toast.success("Deleted");
        fetchProducts();
    };

    const handleLogout = async () => {
        await axios.post("/logout");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="layout">
            <Toaster />

            <div className="main-content">

                <div className="product-container">
                    <h2>Products</h2>

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

                    <div className="product-form">
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                        {errors.name && <p className="error">{errors.name}</p>}

                        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                        {errors.price && <p className="error">{errors.price}</p>}

                        <input type="file" name="image" onChange={handleChange} />

                        <select name="stock" value={form.stock} onChange={handleChange}>
                            <option value={1}>In Stock</option>
                            <option value={0}>Out of Stock</option>
                        </select>

                        <button type="submit" onClick={handleSubmit}>
                            {editId ? "Update" : "Create"}
                        </button>
                    </div>

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

                                <h3 className="card-title">{p.name}</h3>

                                <p className="price">₹{p.price}</p>

                                <span className={`stock ${p.stock ? "in" : "out"}`}>
                                    {p.stock ? "In Stock" : "Out of Stock"}
                                </span>

                                <div className="card-actions">
                                    <button
                                        className="btn-cart"
                                        onClick={() => toast.success("Added to cart")}
                                    >
                                        Add to Cart
                                    </button>

                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(p)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button
                            disabled={!pagination?.current_page || pagination.current_page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </button>

                        <span>
                            Page {pagination?.current_page || 1} of {pagination?.last_page || 1}
                        </span>

                        <button
                            disabled={
                                !pagination?.last_page ||
                                pagination.current_page === pagination.last_page
                            }
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}