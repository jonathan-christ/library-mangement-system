export const emptyMsg = (fieldName) => {
    return "Please enter your " + fieldName
}

export const notEmail = () => {
    return "Please enter a proper email"
}

export const passNotMatch = () => {
    return "Passwords do not match"
}

export const exceedCharLimit = (maxLength) =>{
    return "Input exceeds maximum character limit of " + maxLength
}

export const belowMinChar = (fieldName, minLength) => {
    return fieldName + " needs at least " + minLength + " characters"
} 

export const charOnly = () => {
    return "Input must be character only"
}
