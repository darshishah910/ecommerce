<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:25|min:2',
            'phone' => 'required|numeric|digits:10',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'pincode' => 'required|numeric|digits:6'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'    => 'Please enter your name.',
            'name.string'      => 'Name must be text.',
            'name.max'         => 'Name cannot exceed 25 characters.',
            'name.min'         => 'Name must be at least 2 characters.',
            
            'phone.required'   => 'Phone number is required.',
            'phone.numeric'    => 'Phone number must contain only numbers.',
            'phone.digits'     => 'Phone number must be exactly 10 digits.',
           
            'address.required' => 'Please enter your street address.',
            'address.string'   => 'Address must be a valid string.',
            'address.max'      => 'Address cannot exceed 255 characters.',
            
            'city.required'    => 'City is required.',
            'city.string'      => 'City must be text.',
            'city.max'         => 'City cannot exceed 255 characters.',
            
            'state.required'   => 'State is required.',
            'state.string'     => 'State must be text.',
            'state.max'        => 'State cannot exceed 255 characters.',
            
            'pincode.required' => 'Pincode is required.',
            'pincode.numeric'  => 'Pincode must be numeric.',
            'pincode.digits'   => 'Pincode must be exactly 6 digits.',
        ];

    }
}
