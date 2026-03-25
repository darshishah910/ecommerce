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
       try {
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
       } catch (error) {
        return response()->json([
            'success'=> false,
            'message'=> $error,
        ]);

       }
    }

    public function register(RegisterRequest $request)
    {
        try {
            $data = $this->authService->register($request->validated());

        return response()->json([
            'success'=> true,
            'message'=> 'Register Successfull',
            'data'=> $data,
        ],201);
        } catch (error) {
            return response()->json([
                'success'=> false,
                'message'=> $error,
            ]);
        }
    }

    public function logout(Request $request){
        try {
            $this->authService->logout($request->user());
        return response()->json([
            'success'=> true,
            'message'=> 'Logout Successfull',
        ]);
        } catch (error) {
            return response()->json([
                'success'=> false,
                'message'=> $error,
            ]);
        }

    }
    
}
