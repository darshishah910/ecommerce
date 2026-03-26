<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Services\AddressService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    protected $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->middleware('auth'); 
        $this->addressService = $addressService;
    }


    public function index(Request $request)
    {
        $addresses = $this->addressService->get($request->user());

        return Inertia::render('Address', [
            'addresses' => $addresses
        ]);
    }

    public function store(AddressRequest $request)
    {
        $this->addressService->create(
            $request->user(),
            $request->validated()
        );

        return redirect()->back()->with('success', 'Address added');
    }

    public function update(AddressRequest $request, $id)
    {
        $this->addressService->update(
            $id,
            $request->validated()
        );

        return redirect()->back()->with('success', 'Address updated');
    }

    
    public function destroy($id)
    {
        $this->addressService->delete($id);

        return redirect()->back()->with('success', 'Address deleted');
    }
}