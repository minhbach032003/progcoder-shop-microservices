/**
 * Order Service
 * API service functions for order management
 */

import { api } from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  Order,
  CreateOrUpdateOrderDto,
  UpdateOrderStatusRequest,
  OrderStatus,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types";
import { AxiosResponse } from "axios";

export interface OrderFilterParams extends PaginationParams {
  status?: OrderStatus;
  customerName?: string;
  orderNo?: string;
  fromDate?: string;
  toDate?: string;
  minTotal?: number;
  maxTotal?: number;
}

export const orderService = {
  /**
   * Get orders with filter and pagination
   * @param params - Query parameters (filter, page, pageSize, etc.)
   * @returns Promise with paginated orders
   */
  getOrders: (
    params: OrderFilterParams = {}
  ): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Order>>>> => {
    return api.get(API_ENDPOINTS.ORDER.GET_LIST, { params });
  },

  /**
   * Get all orders with filter (no pagination)
   * @param params - Query parameters (filter)
   * @returns Promise with all orders
   */
  getAllOrders: (
    params: Omit<OrderFilterParams, "pageIndex" | "pageSize"> = {}
  ): Promise<AxiosResponse<ApiResponse<Order[]>>> => {
    return api.get(API_ENDPOINTS.ORDER.GET_ALL, { params });
  },

  /**
   * Get order by ID
   * @param orderId - Order ID
   * @returns Promise with order details
   */
  getOrderById: (orderId: string): Promise<AxiosResponse<ApiResponse<Order>>> => {
    return api.get(API_ENDPOINTS.ORDER.GET_DETAIL(orderId));
  },

  /**
   * Get order by order number
   * @param orderNo - Order number
   * @returns Promise with order details
   */
  getOrderByOrderNo: (orderNo: string): Promise<AxiosResponse<ApiResponse<Order>>> => {
    return api.get(API_ENDPOINTS.ORDER.GET_BY_ORDER_NO(orderNo));
  },

  /**
   * Create a new order
   * @param orderData - CreateOrUpdateOrderDto
   * @returns Promise with created order
   */
  createOrder: (
    orderData: CreateOrUpdateOrderDto
  ): Promise<AxiosResponse<ApiResponse<Order>>> => {
    return api.post(API_ENDPOINTS.ORDER.CREATE, orderData);
  },

  /**
   * Update an existing order
   * @param orderId - Order ID
   * @param orderData - CreateOrUpdateOrderDto
   * @returns Promise with updated order
   */
  updateOrder: (
    orderId: string,
    orderData: CreateOrUpdateOrderDto
  ): Promise<AxiosResponse<ApiResponse<Order>>> => {
    return api.put(API_ENDPOINTS.ORDER.UPDATE(orderId), orderData);
  },

  /**
   * Update order status
   * @param orderId - Order ID
   * @param statusData - UpdateOrderStatusRequest { Status, Reason? }
   * @returns Promise with updated order
   */
  updateOrderStatus: (
    orderId: string,
    statusData: UpdateOrderStatusRequest
  ): Promise<AxiosResponse<ApiResponse<Order>>> => {
    return api.patch(API_ENDPOINTS.ORDER.UPDATE_STATUS(orderId), statusData);
  },
};

export default orderService;
