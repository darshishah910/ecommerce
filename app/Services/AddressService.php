<?php

namespace App\Services;

use App\Models\Address;


class AddressService
{
    public function create($user, $data)
    {
        return Address::create([
            'user_id' => $user->id,
            'name' => $data['name'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'city' => $data['city'],
            'state' => $data['state'],
            'pincode' => $data['pincode'],
        ]);
    }

    public function get($user)
    {
      
         if (is_null($user)) {
               // dd(collect());
            return collect(); 
         }

        return Address::where('user_id', $user->id)->latest()->get();
    }

    public function update($id, $data)
    {
        $address = Address::findOrFail($id);
        $address->update($data);

        return $address;
    }

    public function delete($id)
    {
        return Address::findOrFail($id)->delete();
    }
}