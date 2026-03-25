<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\OrderService;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(){
        $orders = $this->orderService->getOrders();
        return response()->json($orders);
    }

    public function store(Request $request){
         $user = $request->user();
        $order = $this->orderService->createOrder($user, $request->all());
        $order->save();
        
        return response()->json([
            "status"=> "success",
            "message"=> "Order sucessfull"
        ]);
    }

    public function update(Request $request, Order $order){
        $this->orderService->updateOrder($order, $request->all());
        return response()->json([
            "status"=> "success",
            "message"=> "Order Updated"
        ]);
    }

    public function destroy(Order $order){
        $this->orderService->deleteOrder($order);
        return response()->json([
            "status"=> "success",
            "message"=> "Order Deleted"
        ]);
    }


}
