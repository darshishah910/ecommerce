<?php
namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function create($user, $address)
    {
        return DB::transaction(function () use ($user, $address) {

            $cart = Cart::with('items.product')
                ->where('user_id', $user->id)
                ->first();

            if (!$cart || $cart->items->isEmpty()) {
                throw new \Exception("Cart is empty");
            }

            $totalAmount = 0;

            foreach ($cart->items as $item) {
                if ($item->product->stock < $item->quantity) {
                    throw new \Exception("Stock not available for {$item->product->name}");
                }

                $totalAmount += $item->quantity * $item->product->price;
            }

            $order = Order::create([
                "user_id" => $user->id,
                "address_id" => $address->id,
                "total_amount" => $totalAmount,
                "status" => "pending",
            ]);

            foreach ($cart->items as $item) {

                OrderItem::create([
                    "order_id" => $order->id,
                    "product_id" => $item->product_id,
                    "quantity" => $item->quantity,
                    "price" => $item->product->price,
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            
            $cart->items()->delete();

            return $order;
        });
    }

    public function get($user)
    {
        return Order::with('items.product', 'address')
            ->where('user_id', $user->id)
            ->latest()
            ->get();
            
    }
}