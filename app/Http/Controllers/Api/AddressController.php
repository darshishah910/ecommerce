<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Services\AddressService;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    protected $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->middleware('auth:api'); 
        $this->addressService = $addressService;
    }

    public function index(Request $request)
    {
        return response()->json(
            $this->addressService->get($request->user())
        );
    }


    public function store(AddressRequest $request)
    {
        return response()->json(
            $this->addressService->create(
                $request->user(),
                $request->validated()
            )
        );
    }


    public function update(AddressRequest $request, $id)
    {
        return response()->json(
            $this->addressService->update(
                $id,
                $request->validated()
            )
        );
    }

    public function destroy($id)
    {
        $this->addressService->delete($id);

        return response()->json([
            'message' => 'Address deleted'
        ]);
    }
}