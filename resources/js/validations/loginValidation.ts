export const validateLogin = (form: any) => {
    const errors: any = {};

    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+$/;

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
        errors.password ='Password must contain 1 uppercase, 1 number, and 1 special character';
    }

    return errors;
};