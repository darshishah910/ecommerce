<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService{

   public function register(array $data){
    $user = Auth::user();try {
      // dump($data);
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password'=> Hash::make($data['password']),
        ]);

        // dd($user);
        return $user;
    } catch (error) {
         return false;
    }
   }

   public function login(array $data){
     try {
      $user = User::where('email' , $data['email'])->first();

     if(!$user || !Hash::check($data['password'], $user->password)){
        return null;
     }

     $token = $user->createToken('authToken')->accessToken;

     return [
        'user' => $user,
        'token'=> $token,
        'role' => $user->role ?? 'user',
     ];
     } catch (error) {
       return false;
     }
   }


   public function logout($user){
        try {
         $user->token()->revoke();
        return true;
        } catch (error) {
         return false;
        }
   }
    
}