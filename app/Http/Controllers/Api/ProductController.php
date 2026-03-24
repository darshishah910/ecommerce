<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Requests\ProductRequest;
use App\Services\ProductService;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request){
        return response()->json(
            $this->productService->getAll($request)
        );
    }

    Public function store(ProductRequest $request){
        $product = $this->productService->create($request->validated());

        return response()->json([
            'message' => 'created',
            'data' => $product
        ]);
    }

    public function update(ProductRequest $request,$id){
        $product = $this->productService->update($id, $request->validated());

        return response()->json([
            'message'=> 'Updated',
            'data' => $product
        ]);
   }

   public function destroy($id){
    $product = $this->productService->destroy($id);
    
    return response()->json([
        'message'=> 'Deleted',
        'data'=> $product
    ]);
   }

}
