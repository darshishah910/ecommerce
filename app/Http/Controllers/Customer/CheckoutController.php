<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Address;
use App\Models\User;
use App\Services\AddressService;



class CheckoutController extends Controller
{
    protected $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->addressService = $addressService;
        // $this->middleware('auth');
    }

    // public function index(Request $request, User $user)
    // {
    //     $addresses = Address::where('user_id', $request->user_id)->get();
        
    //     return Inertia::render("checkout", [
    //         "addresses" => $addresses
    //     ]);
    // }

    public function index(Request $request, User $user){
        $addresses = $this->addressService->get($user->id);
        
        return Inertia::render("checkout", [
            "addresses" => $addresses
        ]);
    }
}