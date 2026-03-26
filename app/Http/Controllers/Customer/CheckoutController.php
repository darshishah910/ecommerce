<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Address;



class CheckoutController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $addresses = Address::where('user_id', $request->user()->id)->get();

        return Inertia::render("Checkout", [
            "addresses" => $addresses
        ]);
    }
}