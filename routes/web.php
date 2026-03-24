<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customer\AuthController;
use App\Http\Controllers\Customer\ProductController;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('products');
});

// Auth routes
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
// Route::post('/register', [AuthController::class, 'register']);

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
// Route::post('/login', [AuthController::class, 'login']);

Route::get('/products',[ProductController::class,'index'])->name('products');


