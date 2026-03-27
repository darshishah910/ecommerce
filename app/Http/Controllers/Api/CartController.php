<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CartService;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        return response()->json(
            $this->cartService->get(
                $request->user(),
                $request->guest_id
            )
        );
    }

    public function add(Request $request)
{
    return response()->json(
        $this->cartService->add(
            $request->user(),
            $request->input('guest_id'),   
            $request->input('product_id'), 
            $request->input('quantity', 1)
        )
    );
    dd([
    'guest_id' => $request->input('guest_id'),
    'product_id' => $request->input('product_id'),
]);
}

    public function update(Request $request, $id)
    {
        return response()->json(
            $this->cartService->update($id, $request->quantity)
        );
    }

    public function remove($id)
    {
        $this->cartService->remove($id);
        return response()->json(['message' => 'Removed']);
    }

    public function removeAll(Request $request)
{
   
    $this->cartService->removeAll(
        $request->user(),
        $request->guest_id
    );

    return response()->json(['message' => 'Cart cleared']);
}

    public function merge(Request $request)
    {
        return response()->json(
            $this->cartService->merge(
                $request->user(),
                $request->guest_id
            )
        );
    }
}