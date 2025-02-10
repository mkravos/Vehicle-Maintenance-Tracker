/*
    InputValidation.js

    A package containing methods for validating user input.
*/

export function validatePassword(str, verify_str) {
    if (containsWhitespace(str)) {
        return "Password cannot contain a space.";
    } else if (!checkPasswordLength(str)) {
        return "Password must be at least 10 characters long.";
    } else if (verify_str && str !== verify_str) {
        return "Passwords do not match.";
    } else return "";
}

export function validateUsername(str) {
    if (containsWhitespace(str)) {
        return "Username cannot contain a space.";
    } else if (containsSpecialChars(str)) {
        return "Username can't contain special characters.";
    } else if (!checkUsernameLength(str)) {
        return "Username must be at least 3 characters long.";
    } else return "";
}

export function checkInteger(str) {
    return /^[0-9]*$/.test(str);
}

export function checkAlphanumeric(str) {
    return /^[a-z0-9]+$/.test(str);
}

export function containsWhitespace(str) {
    return /\s/.test(str);
}

export function containsSpecialChars(str) {
    return /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(str);
}

export function checkUsernameLength(str) {
    if (str.length < 3) {
        return false;
    } else return true;
}

export function checkPasswordLength(str) {
    if (str.length < 10) {
        return false;
    } else return true;
}