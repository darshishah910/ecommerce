<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CartService;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        $cart = $this->cartService->getCart($request->user(), $request->guest_id);
        return Inertia::render("cart", [
            "cart"=> $cart
        ]);    
        // dd($cart);    
    }

    public function store(Request $request)
    {
        $this->cartService->storeCart($request->all());
        return redirect()->route("cart");
    }
}
