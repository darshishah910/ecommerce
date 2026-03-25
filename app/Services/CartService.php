<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;

class CartService
{
    public function getCart($user, $guestId)
    {
        if ($user) {
            return Cart::firstOrCreate(['user_id' => $user->id]);
        }

        return Cart::firstOrCreate(['guest_id' => $guestId]);
    }

    public function add($user, $guestId, $productId, $qty = 1)
    {
        $cart = $this->getCart($user, $guestId);

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

    public function update($itemId, $qty)
    {
        $item = CartItem::findOrFail($itemId);
        $item->update(['quantity' => $qty]);

        return $item;
    }

    public function remove($itemId)
    {
        return CartItem::findOrFail($itemId)->delete();
    }

    public function removeAll()
    {
        return CartItem::findOrFail()->delete();
    }

    public function get($user, $guestId)
    {
        $cart = $this->getCart($user, $guestId);
        return $cart->load('items.product');
    }

    public function merge($user, $guestId)
    {
        $guestCart = Cart::where('guest_id', $guestId)->first();
        $userCart = Cart::firstOrCreate(['user_id' => $user->id]);

        if (!$guestCart) return $userCart;

        foreach ($guestCart->items as $item) {
            $existing = CartItem::where('cart_id', $userCart->id)
                ->where('product_id', $item->product_id)
                ->first();

            if ($existing) {
                $existing->increment('quantity', $item->quantity);
            } else {
                CartItem::create([
                    'cart_id' => $userCart->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity
                ]);
            }
        }

        $guestCart->delete();

        return $userCart->load('items.product');
    }
}