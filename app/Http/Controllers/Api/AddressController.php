<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\AddressRequest;
use App\Models\Address;
use App\Services\AddressService;

class AddressController extends Controller
{
    protected $service;

    public function __construct(AddressService $service)
    {
        $this->service = $service;
    }

    public function index(){
        $address = $this->service->list();
        return response()->json($address);
    }

    public function store(AddressRequest $request)
{
    $address = $this->service->create($request->validated());
    
    return response()->json([
        'success' => true,
        'data' => $address,
        'message' => 'Address created successfully'
    ], 201); 
}

        
public function update(AddAddressRequest $request, Address $address)
{
    $updatedAddress = $this->service->updateAddress($address, $request->validated());
   
    return response()->json([
        'success' => true,
        'data' => $updatedAddress,
        'message' => 'Address updated successfully'
    ], 200);
}


    public function destroy(Address $address){
    $address->delete();
    return response()->json(['message' => 'Address deleted successfully'], 200);
}


}
