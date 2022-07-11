/*
    InputValidation.js

    A package containing methods for validating user input.
*/

export function containsWhitespace(str) {
    return /\s/.test(str);
}

export function containsSpecialChars(str) {
    return /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(str);
}