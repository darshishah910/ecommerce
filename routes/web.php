<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customer\AuthController;
use App\Http\Controllers\Customer\ProductController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\AddressController;
use App\Http\Controllers\Customer\CheckOutController;

use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('products');
});

// Auth routes
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');

Route::get('/products',[ProductController::class,'index'])->name('products');

Route::get('/cart',[CartController::class,'index']);

Route::get('/orders',[OrderController::class,'index']);

Route::get('/checkout',[CheckOutController::class,'index'])->name("checkout");

Route::get('/addresses', [AddressController::class, 'index'])->name('address');


