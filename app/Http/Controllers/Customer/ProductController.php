<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Requests\ProductRequest;
use App\Services\ProductService;
use Inertia\Inertia;


class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        return Inertia::render("products", [
            "products"=> $this->productService->getAll($request),
        ]);
    }

    public function store(ProductRequest $request){
        $this->productService->create($request->validated());

        return back()->with("success","Product Created");
    }

    public function update(ProductRequest $request, $id){
        $this->productService->update($id, $request->validated());

        return back()->with("success","Product Updated");
    }

    public function destroy($id){
        $this->productService->delete($id);

        return back()->with("success","Product Deleted");
    }
    
    
}
