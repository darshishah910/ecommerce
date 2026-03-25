<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\OrderService;
use Inertia\Inertia;    

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index()
    {
        return Inertia::render("order", [
            "order"=> Order::orderBy("id","desc")->paginate(10),
        ]);

    
    }
}