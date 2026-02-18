/**
 * Notification Service
 * API service functions for notification management
 */

import { api } from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Notification, ApiResponse } from "@/types";
import { AxiosResponse } from "axios";

export interface NotificationCountResponse {
  count: number;
}

export interface MarkAsReadRequest {
  ids: string[];
}

export interface MarkAsReadResponse {
  success: boolean;
  updatedCount: number;
}

export const notificationService = {
  /**
   * Get top 10 unread notifications for dropdown
   * @returns Promise with top 10 unread notifications
   */
  getTop10Unread: (): Promise<AxiosResponse<ApiResponse<Notification[]>>> => {
    return api.get(API_ENDPOINTS.NOTIFICATION.GET_TOP_10_UNREAD);
  },

  /**
   * Get unread count for badge
   * @returns Promise with unread notification count
   */
  getUnreadCount: (): Promise<
    AxiosResponse<ApiResponse<NotificationCountResponse>>
  > => {
    return api.get(API_ENDPOINTS.NOTIFICATION.GET_COUNT_UNREAD);
  },

  /**
   * Get all notifications with pagination
   * @returns Promise with all notifications
   */
  getAll: (): Promise<AxiosResponse<ApiResponse<Notification[]>>> => {
    return api.get(API_ENDPOINTS.NOTIFICATION.GET_ALL);
  },

  /**
   * Mark notifications as read
   * @param ids - Array of notification IDs to mark as read
   * @returns Promise with mark result
   */
  markAsRead: (
    ids: string[]
  ): Promise<AxiosResponse<ApiResponse<MarkAsReadResponse>>> => {
    const requestData: MarkAsReadRequest = { ids };
    return api.post(API_ENDPOINTS.NOTIFICATION.MARK_AS_READ, requestData);
  },
};

export default notificationService;
