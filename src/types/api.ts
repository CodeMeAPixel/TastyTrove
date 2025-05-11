export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface RecipeStatsResponse {
  totalRecipes: number
  totalLikes: number
  avgRating: number
  topCategories: Array<{ category: string; count: number }>
}

export interface UserStatsResponse {
  totalRecipes: number
  totalLikes: number
  totalFollowers: number
  totalFollowing: number
  popularRecipes: Array<{ id: number; name: string; likes: number }>
}
