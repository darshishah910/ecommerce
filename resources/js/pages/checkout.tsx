import axios from "../lib/axios";
import Navbar from "../components/ecommerce/Navbar";
import Footer from "../components/ecommerce/Footer";
import "../styles/style.css"

export default function Checkout(){
    return <>
        <Navbar/>
        <h1>checkout</h1>

        <form action="">
            <input type="text"   placeholder="Enter User Name"/>
            <input type="number"  placeholder="Enter Phone Number"/>
            <input type="text"  placeholder="Enter address" />
            <input type="text"  placeholder="Enter city"/>
            <input type="text"  placeholder="Enter state"/>
            <input type="number"  placeholder="Enter pincode"/>
            <button type="submit">Submit</button>
        </form>

        

        <Footer/>
    </>
}