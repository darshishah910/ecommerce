<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductService{
    
    public function getAll($request){

        $query = Product::query();
        
        if($request->search){
            $query->where("name","like","%".$request->search."%");
        }

        $product = $query->latest()->paginate(10);
        

        $product->getCollection()->transform(function ($p) {
           return [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'price' => $p->price,
                'stock' => $p->stock,
                'image' => $p->image ? asset('storage/' . $p->image) : null,
            ];
        });

        return $product;

    }

    public function create($data){
        if (isset($data['image'])){
            $data['image'] = $data['image'] -> store('product','public');
        }

        return Product::create($data);
    }

    public function update($id,$data){
        $product = Product::findOrFail($id);

        if(isset($data['image'])){
            if($product->image){
                Storage::disk('public')->delete($product->image);
            }

            $data['image'] = $data['image'] -> store('product','public');
        }

        $product->update($data);

        return $product;
    }

    public function destroy($id){
        $product = Product::findOrFail($id);

        if($product->image){
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
    }

}