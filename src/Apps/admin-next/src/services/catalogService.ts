/**
 * Catalog Service
 * API service functions for product, category, and brand management
 */

import { api } from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  Product,
  Category,
  Brand,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateBrandDto,
  UpdateBrandDto,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types";
import { AxiosResponse } from "axios";

export interface ProductFilterParams extends PaginationParams {
  categoryId?: string;
  brandId?: string;
  status?: number;
  minPrice?: number;
  maxPrice?: number;
}

export const catalogService = {
  // ==================== Products ====================

  /**
   * Get all products (no pagination)
   * @returns Promise with all products
   */
  getAllProducts: (): Promise<AxiosResponse<ApiResponse<Product[]>>> => {
    return api.get(API_ENDPOINTS.CATALOG.GET_ALL_PRODUCTS);
  },

  /**
   * Get products with filter and pagination
   * @param params - Query parameters (filter, page, pageSize, etc.)
   * @returns Promise with paginated products
   */
  getProducts: (
    params: ProductFilterParams = {}
  ): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Product>>>> => {
    return api.get(API_ENDPOINTS.CATALOG.GET_PRODUCTS, { params });
  },

  /**
   * Get product by ID
   * @param productId - Product ID
   * @returns Promise with product details
   */
  getProductById: (
    productId: string
  ): Promise<AxiosResponse<ApiResponse<Product>>> => {
    return api.get(API_ENDPOINTS.CATALOG.GET_PRODUCT_DETAIL(productId));
  },

  /**
   * Create a new product
   * @param productFormData - Product data (multipart/form-data)
   * @returns Promise with created product
   */
  createProduct: (
    productFormData: FormData
  ): Promise<AxiosResponse<ApiResponse<Product>>> => {
    return api.post(API_ENDPOINTS.CATALOG.CREATE_PRODUCT, productFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update an existing product
   * @param productId - Product ID
   * @param productFormData - Product data (multipart/form-data)
   * @returns Promise with updated product
   */
  updateProduct: (
    productId: string,
    productFormData: FormData
  ): Promise<AxiosResponse<ApiResponse<Product>>> => {
    return api.put(
      API_ENDPOINTS.CATALOG.UPDATE_PRODUCT(productId),
      productFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  /**
   * Delete a product
   * @param productId - Product ID
   * @returns Promise with deletion result
   */
  deleteProduct: (productId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    return api.delete(API_ENDPOINTS.CATALOG.DELETE_PRODUCT(productId));
  },

  /**
   * Publish a product
   * @param productId - Product ID
   * @returns Promise with published product
   */
  publishProduct: (productId: string): Promise<AxiosResponse<ApiResponse<Product>>> => {
    return api.post(API_ENDPOINTS.CATALOG.PUBLISH_PRODUCT(productId));
  },

  /**
   * Unpublish a product
   * @param productId - Product ID
   * @returns Promise with unpublished product
   */
  unpublishProduct: (productId: string): Promise<AxiosResponse<ApiResponse<Product>>> => {
    return api.post(API_ENDPOINTS.CATALOG.UNPUBLISH_PRODUCT(productId));
  },

  // ==================== Categories ====================

  /**
   * Get all categories
   * @returns Promise with all categories
   */
  getCategories: (): Promise<AxiosResponse<ApiResponse<Category[]>>> => {
    return api.get(API_ENDPOINTS.CATALOG.GET_CATEGORIES);
  },

  /**
   * Get category tree
   * @returns Promise with category tree structure
   */
  getCategoryTree: (): Promise<AxiosResponse<ApiResponse<Category[]>>> => {
    return api.get(API_ENDPOINTS.CATALOG.GET_CATEGORY_TREE);
  },

  /**
   * Get category by ID
   * @param categoryId - Category ID
   * @returns Promise with category details
   */
  getCategoryById: (
    categoryId: string
  ): Promise<AxiosResponse<ApiResponse<Category>>> => {
    return api.get(API_ENDPOINTS.CATALOG.GET_CATEGORY_DETAIL(categoryId));
  },

  /**
   * Create a new category
   * @param categoryData - CreateCategoryDto
   * @returns Promise with created category
   */
  createCategory: (
    categoryData: CreateCategoryDto
  ): Promise<AxiosResponse<ApiResponse<Category>>> => {
    return api.post(API_ENDPOINTS.CATALOG.CREATE_CATEGORY, categoryData);
  },

  /**
   * Update an existing category
   * @param categoryId - Category ID
   * @param categoryData - UpdateCategoryDto
   * @returns Promise with updated category
   */
  updateCategory: (
    categoryId: string,
    categoryData: UpdateCategoryDto
  ): Promise<AxiosResponse<ApiResponse<Category>>> => {
    return api.put(
      API_ENDPOINTS.CATALOG.UPDATE_CATEGORY(categoryId),
      categoryData
    );
  },

  /**
   * Delete a category
   * @param categoryId - Category ID
   * @returns Promise with deletion result
   */
  deleteCategory: (categoryId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    return api.delete(API_ENDPOINTS.CATALOG.DELETE_CATEGORY(categoryId));
  },

  // ==================== Brands ====================

  /**
   * Get all brands
   * @returns Promise with all brands
   */
  getBrands: (): Promise<AxiosResponse<ApiResponse<Brand[]>>> => {
    return api.get(API_ENDPOINTS.CATALOG.GET_BRANDS);
  },

  /**
   * Get brand by ID
   * @param brandId - Brand ID
   * @returns Promise with brand details
   */
  getBrandById: (brandId: string): Promise<AxiosResponse<ApiResponse<Brand>>> => {
    return api.get(API_ENDPOINTS.CATALOG.GET_BRAND_DETAIL(brandId));
  },

  /**
   * Create a new brand
   * @param brandData - CreateBrandDto
   * @returns Promise with created brand
   */
  createBrand: (
    brandData: CreateBrandDto
  ): Promise<AxiosResponse<ApiResponse<Brand>>> => {
    return api.post(API_ENDPOINTS.CATALOG.CREATE_BRAND, brandData);
  },

  /**
   * Update an existing brand
   * @param brandId - Brand ID
   * @param brandData - UpdateBrandDto
   * @returns Promise with updated brand
   */
  updateBrand: (
    brandId: string,
    brandData: UpdateBrandDto
  ): Promise<AxiosResponse<ApiResponse<Brand>>> => {
    return api.put(API_ENDPOINTS.CATALOG.UPDATE_BRAND(brandId), brandData);
  },

  /**
   * Delete a brand
   * @param brandId - Brand ID
   * @returns Promise with deletion result
   */
  deleteBrand: (brandId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    return api.delete(API_ENDPOINTS.CATALOG.DELETE_BRAND(brandId));
  },
};

export default catalogService;
