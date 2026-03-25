import axios from "../lib/axios"

import "../styles/style.css";
import { toast, Toaster } from "react-hot-toast";
import { validateProduct } from "../validations/productValidation";
import Navbar from "@/components/ecommerce/Navbar";
import Footer from "@/components/ecommerce/Footer";

export default function Address(){
    return <div>
        <Navbar/>
        <h1>hello</h1>
        <Footer/>
    </div>
}