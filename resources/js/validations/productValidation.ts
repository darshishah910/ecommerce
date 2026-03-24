export const validateProduct = (form: any, isEdit: boolean = false) => {
    const errors: any = {};

    if (!form.name || form.name.trim() === "") {
        errors.name = "Product name is required";
    } else if (form.name.length > 255) {
        errors.name = "Max 255 characters allowed";
    }

    if (!form.price) {
        errors.price = "Price is required";
    } else if (isNaN(form.price)) {
        errors.price = "Price must be a number";
    } else if (Number(form.price) < 0) {
        errors.price = "Price cannot be negative";
    }

    if (!isEdit && !form.image) {
        errors.image = "Product image is required";
    }

    if (![0, 1].includes(Number(form.stock))) {
        errors.stock = "Invalid stock value";
    }

    return errors;
};