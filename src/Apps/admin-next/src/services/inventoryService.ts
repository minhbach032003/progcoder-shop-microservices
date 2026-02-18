/**
 * Inventory Service
 * API service functions for inventory management
 */

import { api } from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  InventoryItem,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  Location,
  CreateLocationDto,
  UpdateLocationDto,
  InventoryHistory,
  InventoryReservation,
  IncreaseStockRequest,
  DecreaseStockRequest,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from "@/types";
import { AxiosResponse } from "axios";

export interface InventoryFilterParams extends PaginationParams {
  productId?: string;
  locationId?: string;
  lowStock?: boolean;
}

export const inventoryService = {
  // ==================== Inventory Items ====================

  /**
   * Get all inventory items (no pagination)
   * @returns Promise with all inventory items
   */
  getAllInventoryItems: (): Promise<AxiosResponse<ApiResponse<InventoryItem[]>>> => {
    return api.get(API_ENDPOINTS.INVENTORY.GET_ALL);
  },

  /**
   * Get inventory items with filter and pagination
   * @param params - Query parameters (filter, page, pageSize, etc.)
   * @returns Promise with paginated inventory items
   */
  getInventoryItems: (
    params: InventoryFilterParams = {}
  ): Promise<AxiosResponse<ApiResponse<PaginatedResponse<InventoryItem>>>> => {
    return api.get(API_ENDPOINTS.INVENTORY.GET_LIST, { params });
  },

  /**
   * Get inventory item by ID
   * @param itemId - Inventory item ID
   * @returns Promise with inventory item details
   */
  getInventoryItemById: (
    itemId: string
  ): Promise<AxiosResponse<ApiResponse<InventoryItem>>> => {
    return api.get(API_ENDPOINTS.INVENTORY.GET_DETAIL(itemId));
  },

  /**
   * Create a new inventory item
   * @param itemData - CreateInventoryItemDto
   * @returns Promise with created inventory item
   */
  createInventoryItem: (
    itemData: CreateInventoryItemDto
  ): Promise<AxiosResponse<ApiResponse<InventoryItem>>> => {
    return api.post(API_ENDPOINTS.INVENTORY.CREATE, itemData);
  },

  /**
   * Update an existing inventory item
   * @param itemId - Inventory item ID
   * @param itemData - UpdateInventoryItemDto
   * @returns Promise with updated inventory item
   */
  updateInventoryItem: (
    itemId: string,
    itemData: UpdateInventoryItemDto
  ): Promise<AxiosResponse<ApiResponse<InventoryItem>>> => {
    return api.put(API_ENDPOINTS.INVENTORY.UPDATE(itemId), itemData);
  },

  /**
   * Delete an inventory item
   * @param itemId - Inventory item ID
   * @returns Promise with deletion result
   */
  deleteInventoryItem: (itemId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    return api.delete(API_ENDPOINTS.INVENTORY.DELETE(itemId));
  },

  /**
   * Increase stock quantity
   * @param itemId - Inventory item ID
   * @param stockData - IncreaseStockRequest { Quantity, Reason }
   * @returns Promise with updated inventory item
   */
  increaseStock: (
    itemId: string,
    stockData: IncreaseStockRequest
  ): Promise<AxiosResponse<ApiResponse<InventoryItem>>> => {
    return api.put(API_ENDPOINTS.INVENTORY.INCREASE_STOCK(itemId), stockData);
  },

  /**
   * Decrease stock quantity
   * @param itemId - Inventory item ID
   * @param stockData - DecreaseStockRequest { Quantity, Reason }
   * @returns Promise with updated inventory item
   */
  decreaseStock: (
    itemId: string,
    stockData: DecreaseStockRequest
  ): Promise<AxiosResponse<ApiResponse<InventoryItem>>> => {
    return api.put(API_ENDPOINTS.INVENTORY.DECREASE_STOCK(itemId), stockData);
  },

  // ==================== Locations ====================

  /**
   * Get all locations
   * @returns Promise with all locations
   */
  getLocations: (): Promise<AxiosResponse<ApiResponse<Location[]>>> => {
    return api.get(API_ENDPOINTS.INVENTORY.GET_LOCATIONS);
  },

  /**
   * Get location by ID
   * @param locationId - Location ID
   * @returns Promise with location details
   */
  getLocationById: (
    locationId: string
  ): Promise<AxiosResponse<ApiResponse<Location>>> => {
    return api.get(API_ENDPOINTS.INVENTORY.GET_LOCATION(locationId));
  },

  /**
   * Create a new location
   * @param locationData - CreateLocationDto
   * @returns Promise with created location
   */
  createLocation: (
    locationData: CreateLocationDto
  ): Promise<AxiosResponse<ApiResponse<Location>>> => {
    return api.post(API_ENDPOINTS.INVENTORY.CREATE_LOCATION, locationData);
  },

  /**
   * Update an existing location
   * @param locationId - Location ID
   * @param locationData - UpdateLocationDto
   * @returns Promise with updated location
   */
  updateLocation: (
    locationId: string,
    locationData: UpdateLocationDto
  ): Promise<AxiosResponse<ApiResponse<Location>>> => {
    return api.put(API_ENDPOINTS.INVENTORY.UPDATE_LOCATION(locationId), locationData);
  },

  /**
   * Delete a location
   * @param locationId - Location ID
   * @returns Promise with deletion result
   */
  deleteLocation: (locationId: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    return api.delete(API_ENDPOINTS.INVENTORY.DELETE_LOCATION(locationId));
  },

  // ==================== Histories ====================

  /**
   * Get inventory change histories
   * @returns Promise with inventory history records
   */
  getHistories: (): Promise<AxiosResponse<ApiResponse<InventoryHistory[]>>> => {
    return api.get(API_ENDPOINTS.INVENTORY.GET_HISTORIES);
  },

  // ==================== Reservations ====================

  /**
   * Get all inventory reservations
   * @returns Promise with inventory reservations
   */
  getAllReservations: (): Promise<AxiosResponse<ApiResponse<InventoryReservation[]>>> => {
    return api.get(API_ENDPOINTS.INVENTORY.GET_ALL_RESERVATIONS);
  },
};

export default inventoryService;
