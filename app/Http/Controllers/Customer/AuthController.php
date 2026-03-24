<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Inertia\Inertia;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

   
    public function showRegister()
    {
        return Inertia::render('register');
    }

    
    public function register(RegisterRequest $request)
    {
        $this->authService->register($request->validated());

        return redirect()
            ->route('login')
            ->with('success', 'Register Successfully');
    }

    
    public function showLogin()
    {
        return Inertia::render('login');
    }

   public function login(LoginRequest $request)
    {
        $success = $this->authService->loginWeb($request->validated());

        if (!$success) {
            return back()->withErrors([
                'email' => 'Invalid credentials'
            ]);
        }

        return redirect()->route('product');
    }

    public function logout()
    {
        $this->authService->logoutWeb();

        return redirect()->route('login');
    }
}