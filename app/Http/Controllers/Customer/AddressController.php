<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\AddressRequest;
use App\Models\Address;
use App\Services\AddressService;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function index(){
        $address = Address::all();
        return Inertia::render("address", [
            "address"=> $address,
        ]);
    }

    public function store(AddressRequest $request){
        $address = Address::create($request->all());
        return redirect()->route("address")->with("success","Address added Successfully");
    }

    public function show(Address $address){
        return Inertia::render("address", [
            "address"=> $address
        ]);
    }

    public function edit(Address $address){
        return Insetia::render("address", [
            "address"=> $address
        ]);
    }

    public function update(AddressRequest $request, Address $address){
        $address->update($request->all());
        return redirect()->route("address")->with("success","Address Updated");
    }

    public function destroy(Address $address){
        $address->delete();
        return redirect()->route("address")->with("success","address deleted");
    }

    
}
