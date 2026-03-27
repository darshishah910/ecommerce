<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Services\OrderService;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(Request $request)
{
    $user = $request->user();
    $address = Address::findOrFail($request->address_id);

    $order = $this->orderService->create($user, $address);

    return response()->json([
        "status" => "success",
        "message" => "Order placed successfully",
        "order" => $order
    ]);
}

public function index(Request $request)
{
    $orders = $this->orderService->get($request->user());

    return response()->json($orders);
}

public function updateStatus(Request $request, Order $order)
{
    if ($request->user()->role !== 'admin') {
        return response()->json([
            "message" => "Unauthorized"
        ], 403);
    }

    $request->validate([
        'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
    ]);

    $order->update([
        'status' => $request->status
    ]);

    return response()->json([
        "message" => "Order status updated"
    ]);
}

public function allOrders(Request $request)
{
    if ($request->user()->role !== 'admin') {
        return response()->json([
            "message" => "Unauthorized"
        ], 403);
    }

    $orders = Order::with('items.product', 'address', 'user')
        ->latest()
        ->get();

    return response()->json($orders);
}
}
