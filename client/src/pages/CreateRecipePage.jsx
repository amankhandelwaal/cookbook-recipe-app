import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Plus, ChefHat, Save, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schema for validation
const recipeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  prepTime: z.string().min(1, 'Prep time is required'),
  cookTime: z.string().min(1, 'Cook time is required'),
  servings: z.string().min(1, 'Number of servings is required'),
  difficulty: z.string(),
  category: z.string(),
  imageUrl: z.string().optional(),
  ingredients: z.array(
    z.object({
      amount: z.string().min(1, 'Amount is required'),
      unit: z.string(),
      name: z.string().min(1, 'Ingredient name is required'),
    })
  ),
  steps: z.array(
    z.object({
      description: z.string().min(1, 'Step description is required'),
    })
  ),
});

export default function CreateRecipePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: [{ amount: '', unit: 'g', name: '' }],
      steps: [{ description: '' }],
      difficulty: 'Medium',
      category: 'Main Course',
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } =
    useFieldArray({ control, name: 'ingredients' });

  const { fields: stepFields, append: appendStep, remove: removeStep } =
    useFieldArray({ control, name: 'steps' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:3000/recipe', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          username: 'chef_john', // Replace with dynamic user info if available
          email: 'john@example.com',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create recipe');
      }

      setSuccessMessage('Recipe created successfully!');
      reset();
    } catch (error) {
      setApiError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            Create Recipe
          </h1>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {apiError}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              </div>
              
              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
              </div>
              
              {/* Prep Time */}
              <div>
                <Label htmlFor="prepTime">Prep Time</Label>
                <Input id="prepTime" {...register('prepTime')} />
                {errors.prepTime && <p className="text-red-500">{errors.prepTime.message}</p>}
              </div>
              
              {/* Cook Time */}
              <div>
                <Label htmlFor="cookTime">Cook Time</Label>
                <Input id="cookTime" {...register('cookTime')} />
                {errors.cookTime && <p className="text-red-500">{errors.cookTime.message}</p>}
              </div>
              
              {/* Servings */}
              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input id="servings" {...register('servings')} />
                {errors.servings && <p className="text-red-500">{errors.servings.message}</p>}
              </div>

              {/* Difficulty */}
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select {...register('difficulty')} defaultValue="Medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select {...register('category')} defaultValue="Main Course">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Appetizer">Appetizer</SelectItem>
                    <SelectItem value="Main Course">Main Course</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <Input
                    placeholder="Amount"
                    {...register(`ingredients.${index}.amount`)}
                  />
                  <Input
                    placeholder="Unit"
                    {...register(`ingredients.${index}.unit`)}
                  />
                  <Input
                    placeholder="Name"
                    {...register(`ingredients.${index}.name`)}
                  />
                  <Button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => appendIngredient({ amount: '', unit: '', name: '' })}
                className="text-green-500"
              >
                <Plus /> Add Ingredient
              </Button>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Steps</h2>
              {stepFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <Textarea
                    placeholder="Step description"
                    {...register(`steps.${index}.description`)}
                  />
                  <Button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-red-500"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => appendStep({ description: '' })}
                className="text-green-500"
              >
                <Plus /> Add Step
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Recipe...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Recipe
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}