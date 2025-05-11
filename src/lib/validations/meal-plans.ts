import { z } from 'zod'

export const mealPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date can't be before start date",
  path: ["endDate"],
});

export const mealPlanItemSchema = z.object({
  mealPlanId: z.number().positive().int(),
  recipeId: z.number().positive().int(),
  scheduledFor: z.date(),
  mealType: z.string().min(1, 'Meal type is required'),
  servings: z.number().min(1, 'At least one serving is required'),
  notes: z.string().optional(),
});

export const getMealPlansSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
});

export const getMealPlanSchema = z.object({
  id: z.number().positive().int(),
});
