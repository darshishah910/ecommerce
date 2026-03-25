<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Customer\CheckOutController;

Route::post("/login",[AuthController::class,"login"]);
Route::post('/register',[AuthController::class,'register']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/cart', [CartController::class, 'index']);


Route::middleware('auth:api')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);


    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);
    Route::delete('/cart/delete'[CartController::class,'removeAll']);
    Route::post('/cart/merge', [CartController::class, 'merge']);

    Route::get('/orders',[OrderController::class,'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

    Route::get('/address',[AddressController::class,'index']);
    Route::post('/address', [AddressController::class, 'store']);
    Route::put('/address/{id}', [AddressController::class, 'update']);
    Route::delete('/address/{id}', [AddressController::class, 'destroy']);

    Route::post('/checkout',[CheckOutController::class,'index']);


});