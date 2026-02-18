/**
 * Discount Service
 * API service functions for coupon/discount management
 */

import { api } from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  UpdateValidityPeriodRequest,
  ValidateCouponRequest,
  ApplyCouponRequest,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types";
import { AxiosResponse } from "axios";

export interface CouponFilterParams extends PaginationParams {
  status?: string;
  discountType?: "percentage" | "fixed";
  isActive?: boolean;
}

export interface ValidateCouponResponse {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  message?: string;
}

export interface ApplyCouponResponse {
  success: boolean;
  orderId: string;
  discountAmount: number;
  finalTotal: number;
  message?: string;
}

export const discountService = {
  /**
   * Get all coupons (no pagination)
   * @returns Promise with all coupons
   */
  getAllCoupons: (): Promise<AxiosResponse<ApiResponse<Coupon[]>>> => {
    return api.get(API_ENDPOINTS.DISCOUNT.GET_ALL_COUPONS);
  },

  /**
   * Get coupons with filter and pagination
   * @param params - Query parameters (filter, page, pageSize, etc.)
   * @returns Promise with paginated coupons
   */
  getCoupons: (
    params: CouponFilterParams = {}
  ): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Coupon>>>> => {
    return api.get(API_ENDPOINTS.DISCOUNT.GET_LIST, { params });
  },

  /**
   * Get coupon by ID
   * @param couponId - Coupon ID
   * @returns Promise with coupon details
   */
  getCouponById: (couponId: string): Promise<AxiosResponse<ApiResponse<Coupon>>> => {
    return api.get(API_ENDPOINTS.DISCOUNT.GET_DETAIL(couponId));
  },

  /**
   * Create a new coupon
   * @param couponData - CreateCouponDto
   * @returns Promise with created coupon
   */
  createCoupon: (
    couponData: CreateCouponDto
  ): Promise<AxiosResponse<ApiResponse<Coupon>>> => {
    return api.post(API_ENDPOINTS.DISCOUNT.CREATE, couponData);
  },

  /**
   * Update an existing coupon
   * @param couponId - Coupon ID
   * @param couponData - UpdateCouponDto
   * @returns Promise with updated coupon
   */
  updateCoupon: (
    couponId: string,
    couponData: UpdateCouponDto
  ): Promise<AxiosResponse<ApiResponse<Coupon>>> => {
    return api.put(API_ENDPOINTS.DISCOUNT.UPDATE(couponId), couponData);
  },

  /**
   * Delete a coupon
   * @param couponId - Coupon ID
   * @returns Promise with deletion result
   */
  deleteCoupon: (couponId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    return api.delete(API_ENDPOINTS.DISCOUNT.DELETE(couponId));
  },

  /**
   * Approve a coupon
   * @param couponId - Coupon ID
   * @returns Promise with approved coupon
   */
  approveCoupon: (couponId: string): Promise<AxiosResponse<ApiResponse<Coupon>>> => {
    return api.post(API_ENDPOINTS.DISCOUNT.APPROVE_COUPON(couponId));
  },

  /**
   * Reject a coupon
   * @param couponId - Coupon ID
   * @returns Promise with rejected coupon
   */
  rejectCoupon: (couponId: string): Promise<AxiosResponse<ApiResponse<Coupon>>> => {
    return api.post(API_ENDPOINTS.DISCOUNT.REJECT_COUPON(couponId));
  },

  /**
   * Update coupon validity period
   * @param couponId - Coupon ID
   * @param validityData - UpdateValidityPeriodRequest { ValidFrom, ValidTo }
   * @returns Promise with updated coupon
   */
  updateValidityPeriod: (
    couponId: string,
    validityData: UpdateValidityPeriodRequest
  ): Promise<AxiosResponse<ApiResponse<Coupon>>> => {
    return api.put(
      API_ENDPOINTS.DISCOUNT.UPDATE_VALIDITY_PERIOD(couponId),
      validityData
    );
  },

  /**
   * Validate a coupon code
   * @param validateData - ValidateCouponRequest
   * @returns Promise with validation result
   */
  validateCoupon: (
    validateData: ValidateCouponRequest
  ): Promise<AxiosResponse<ApiResponse<ValidateCouponResponse>>> => {
    return api.post(API_ENDPOINTS.DISCOUNT.VALIDATE, validateData);
  },

  /**
   * Apply a coupon to order
   * @param applyData - ApplyCouponRequest
   * @returns Promise with apply result
   */
  applyCoupon: (
    applyData: ApplyCouponRequest
  ): Promise<AxiosResponse<ApiResponse<ApplyCouponResponse>>> => {
    return api.post(API_ENDPOINTS.DISCOUNT.APPLY, applyData);
  },
};

export default discountService;
