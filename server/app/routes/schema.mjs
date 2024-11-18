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

const newRecipeSchemaRequest = {
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
    title: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 3, max: 100 }
      },
      errorMessage: "Recipe title must be between 3 and 100 characters"
    },
    category: {
      notEmpty: true,
      isString: true,
      isIn: {
        options: [['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage']],
        errorMessage: "Invalid category selected"
      }
    },
    ingredients: {
      notEmpty: true,
      isArray: true,
      errorMessage: "Ingredients must be an array",
      custom: {
        options: (value) => {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('At least one ingredient is required');
          }
          value.forEach(ingredient => {
            if (typeof ingredient !== 'string' || ingredient.trim().length === 0) {
              throw new Error('Each ingredient must be a non-empty string');
            }
          });
          return true;
        }
      }
    },
    steps: {
      notEmpty: true,
      isArray: true,
      errorMessage: "Steps must be an array",
      custom: {
        options: (value) => {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('At least one step is required');
          }
          value.forEach(step => {
            if (typeof step !== 'string' || step.trim().length === 0) {
              throw new Error('Each step must be a non-empty string');
            }
          });
          return true;
        }
      }
    },
    imageUrl: {
      notEmpty: true,
      isURL: true,
      errorMessage: "Valid image URL is required"
    },
    prepTime: {
      notEmpty: true,
      isInt: {
        options: { min: 1 }
      },
      errorMessage: "Preparation time must be a positive number in minutes"
    },
    servings: {
      notEmpty: true,
      isInt: {
        options: { min: 1 }
      },
      errorMessage: "Number of servings must be a positive number"
    }
  }
  
  const updateRecipeRequest = {
    id: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 24, max: 24 }
      },
      errorMessage: "Invalid recipe id"
    },
    title: {
      optional: true,
      isString: true,
      isLength: {
        options: { min: 3, max: 100 }
      },
      errorMessage: "Recipe title must be between 3 and 100 characters"
    },
    category: {
      optional: true,
      isString: true,
      isIn: {
        options: [['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage']],
        errorMessage: "Invalid category selected"
      }
    },
    ingredients: {
      optional: true,
      isArray: true,
      errorMessage: "Ingredients must be an array",
      custom: {
        options: (value) => {
          if (value && (!Array.isArray(value) || value.length === 0)) {
            throw new Error('At least one ingredient is required');
          }
          if (value) {
            value.forEach(ingredient => {
              if (typeof ingredient !== 'string' || ingredient.trim().length === 0) {
                throw new Error('Each ingredient must be a non-empty string');
              }
            });
          }
          return true;
        }
      }
    },
    steps: {
      optional: true,
      isArray: true,
      errorMessage: "Steps must be an array",
      custom: {
        options: (value) => {
          if (value && (!Array.isArray(value) || value.length === 0)) {
            throw new Error('At least one step is required');
          }
          if (value) {
            value.forEach(step => {
              if (typeof step !== 'string' || step.trim().length === 0) {
                throw new Error('Each step must be a non-empty string');
              }
            });
          }
          return true;
        }
      }
    },
    imageUrl: {
      optional: true,
      isURL: true,
      errorMessage: "Valid image URL is required"
    },
    prepTime: {
      optional: true,
      isInt: {
        options: { min: 1 }
      },
      errorMessage: "Preparation time must be a positive number in minutes"
    },
    servings: {
      optional: true,
      isInt: {
        options: { min: 1 }
      },
      errorMessage: "Number of servings must be a positive number"
    }
  }
  
  const deleteRecipeRequest = {
    id: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 24, max: 24 }
      },
      errorMessage: "Invalid recipe id"
    }
  }

  const addRatingSchema = {
    // recipeId: {
    //   notEmpty: true,
    //   isString: true,
    //   custom: {
    //     options: (value) => {
    //       if (!ObjectId.isValid(value)) {
    //         throw new Error('Invalid recipe ID format');
    //       }
    //       return true;
    //     }
    //   },
    //   errorMessage: "Valid recipe ID is required"
    // },
    rating: {
      notEmpty: true,
      isInt: {
        options: { min: 1, max: 5 }
      },
      errorMessage: "Rating must be between 1 and 5"
    }
  };

  export default {newUserSchemaRequest, userLoginSchema, newRecipeSchemaRequest, updateRecipeRequest, deleteRecipeRequest, addRatingSchema};