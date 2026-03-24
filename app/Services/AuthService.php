<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService{

   public function register(array $data){
    // dump($data);
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password'=> Hash::make($data['password']),
        ]);

        // dd($user);
        return $user;
   }

   public function login(array $data){
     $user = User::where('email' , $data['email'])->first();

     if(!$user || !Hash::check($data['password'], $user->password)){
        return null;
     }

     $token = $user->createToken('authToken')->accessToken;

     return [
        'user' => $user,
        'token'=> $token
     ];
   }


   public function logout($user){
        $user->token()->revoke();
        return true;
   }
    
}