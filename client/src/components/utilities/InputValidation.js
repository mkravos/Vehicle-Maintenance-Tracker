/*
    InputValidation.js

    A package containing methods for validating user input.
*/

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
    if(str.length < 3) {
        return false;
    } else return true;
}

export function checkPasswordLength(str) {
    if(str.length < 10) {
        return false;
    } else return true;
}