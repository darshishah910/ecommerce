<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;

class CartService
{
    public function getCart($user)
{
    if ($user) {
        return Cart::firstOrCreate(['user_id' => $user->id])->load('items.product');
    }

    return session()->get('cart', []);
}

   public function add($user, $guestId, $productId, $qty = 1)
{
    if ($user) {
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        if ($item) {
            $item->increment('quantity', $qty);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'quantity' => $qty
            ]);
        }

        return $cart->load('items.product');
    }

    
    $cart = session()->get('cart', []);

    if (isset($cart[$productId])) {
        $cart[$productId]['quantity'] += $qty;
    } else {
        $cart[$productId] = [
            'product_id' => $productId,
            'quantity' => $qty
        ];
    }

    session()->put('cart', $cart);

    return $cart;
}

    public function update($itemId, $qty)
    {
        $item = CartItem::findOrFail($itemId);
        $item->update(['quantity' => $qty]);

        return $item;
    }

    public function remove($user, $productId)
{
    if ($user) {
        return CartItem::where('product_id', $productId)->delete();
    }

    $cart = session()->get('cart', []);
    unset($cart[$productId]);
    session()->put('cart', $cart);
}

    public function removeAll($user)
{
    if ($user) {
        $cart = Cart::where('user_id', $user->id)->first();
        if ($cart) {
            CartItem::where('cart_id', $cart->id)->delete();
        }
        return;
    }

    session()->forget('cart'); 
}

    public function get($user, $guestId)
    {
        $cart = $this->getCart($user, $guestId);
        return $cart->load('items.product');
    }

    public function merge($user)
{
    $sessionCart = session()->get('cart', []);

    if (!$sessionCart) return;

    $userCart = Cart::firstOrCreate(['user_id' => $user->id]);

    foreach ($sessionCart as $productId => $item) {

        $existing = CartItem::where('cart_id', $userCart->id)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            $existing->increment('quantity', $item['quantity']);
        } else {
            CartItem::create([
                'cart_id' => $userCart->id,
                'product_id' => $productId,
                'quantity' => $item['quantity']
            ]);
        }
    }

    session()->forget('cart'); 
}
}