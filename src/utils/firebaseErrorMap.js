//uitls/firebaseErrorMap.js

export const getFriendlyError = (code) => {
    switch (code) {
        case "auth/email-already-in-use":
            return "This email is already in use.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/invalid-email":
            return "Invalid email address.";
        case "auth/missing-password":
            return "Please enter a password.";
        default:
            return "Something went wrong. Please try again.";
    }
};
