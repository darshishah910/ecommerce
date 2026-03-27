<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            'name'=> 'required|string|max:255',
            'description'=> 'nullable|string|max:1000',
            'price'=> 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image'=> 'required|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required',
            'name.max' => 'Product name must not exceed 255 characters',

            'description.max' => 'Product Description is too long',

            'price.required' => 'Price is required',
            'price.numeric' => 'Price must be a number',
            'price.min' => 'Price cannot be negative',

            'stock.integer' => 'Stock must be a number',
            'stock.min' => 'Stock cannot be negative',

            'image.image' => 'File must be an image',
            'image.mimes' => 'Only JPG, JPEG, PNG allowed',
            'image.max' => 'Image size must be less than 2MB',
        ];
    }
}
