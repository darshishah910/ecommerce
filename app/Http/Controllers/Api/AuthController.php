<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $data = $this->authService->login($request->validated());
        // dd($data);

        if(!$data){
            return response()->json([
                "success" => false,
                "message"=> "Invalid User",
            ],401);
        }

        return response()->json([
            "success"=> true,
            "message"=> "Login Successfull",
            'data' => $data,
        ],200);
    }

    public function register(RegisterRequest $request)
    {
        $data = $this->authService->register($request->validated());

        return response()->json([
            'success'=> true,
            'message'=> 'Register Successfull',
            'data'=> $data,
        ],201);
    }

    public function logout(Request $request){
        $this->authService->logout($request->user());
        return response()->json([
            'success'=> true,
            'message'=> 'Logout Successfull',
        ]);

    }
    
}
