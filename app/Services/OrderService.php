<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;

class OrderService{

    public function createOrder(User $user, array $order){
        $user->orders()->create([
            "user_id"=> $user->id,
            "order_id"=> $order,        
        ]);

        return $user;

    }

    public function updateOrder(User $user, Order $order){
        $user->orders()->update([
            "user_id"=> $user->id,
            "order_id"=> $order->id,
        ]);

        return $user;
    }

    public function deleteOrder(User $user, Order $order){
        $user->orders()->delete();
        return $user;
    }

    public function getOrders(User $user){
        $orders = Order::where("user_id", $user->id)->get();
        return $orders;
    }

    public function getOrdersCount(User $user){
        $orders = Order::where("user_id", $user->id)->count();
        return $orders;
    }

    


  
}