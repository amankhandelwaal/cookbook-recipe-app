import { query, validationResult } from "express-validator";

const newUserSchemaRequest = {
    username: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 20 }
        },
        errorMessage: "Username must be between 3 and 20 characters"
    },
    email: {
        notEmpty: true,
        isEmail: true,
        errorMessage: "Invalid email"
    },
    password: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be atleast 6 characters"
        },
    }
}

const userLoginSchema = {
    username: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 20 }
        },
        errorMessage: "Username must be between 3 and 20 characters"
    },
    password: {
        notEmpty: true,
        isString: true,
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be atleast 6 characters"
        },
    }
}


export default { newUserSchemaRequest, userLoginSchema };