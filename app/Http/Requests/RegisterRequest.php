<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'email' => 'required|email|unique:users, email',
            'password'=> 'required| min:6 | max:10 | regex:/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+$/',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'name.max' => 'Name is too Long',
            'name.min' => 'Name has minimum 2 Character',
            'email.required' => 'Email is required',
            'email.email' => 'Email is invalid',
            'email.unique' => 'Email is already exists',
            'password.required' => 'Password is required',
            'password.min' => 'Password has minimum 6 Character',
            'password.max' => 'Password has maximum 10 Character',
            'password.regex' => 'Password has one capital letter, one special symbol , one number'
        ];
    }
}
