export const validateRegister = (form: any) => {
    const errors: any = {};

    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+$/;

    if (!form.name?.trim()) {
        errors.name = 'Name is required';
    } else if (form.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    } else if (form.name.length > 25) {
        errors.name = 'Name must not exceed 25 characters';
    }

    if (!form.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Enter a valid email address';
    }
  
    if (!form.password) {
        errors.password = 'Password is required';
    } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    } else if (form.password.length > 10) {
        errors.password = 'Password must not exceed 10 characters';
    } else if (!passwordRegex.test(form.password)) {
        errors.password =
            'Password must contain 1 uppercase, 1 number, and 1 special character';
    }

    if (!form.password_confirmation) {
        errors.password_confirmation = 'Confirm password is required';
    } else if (form.password !== form.password_confirmation) {
        errors.password_confirmation = 'Passwords do not match';
    }

    return errors;
};