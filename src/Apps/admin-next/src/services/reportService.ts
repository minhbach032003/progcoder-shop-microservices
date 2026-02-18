/**
 * Report Service
 * Handles all API calls related to dashboard reports and statistics
 */

import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  DashboardStatistics,
  OrderGrowthStatistics,
  TopProductStatistics,
  ApiResponse,
} from "@/types";
import { AxiosResponse } from "axios";

export const reportService = {
  /**
   * Fetch dashboard statistics (Growth, Products Sold, Total Revenue, Total Users)
   * @returns Promise with statistics data
   */
  getDashboardStatistics: async (): Promise<DashboardStatistics> => {
    try {
      const response: AxiosResponse<ApiResponse<DashboardStatistics>> =
        await api.get(API_ENDPOINTS.REPORT.DASHBOARD_STATISTICS);
      return response.data?.data || response.data?.result || {};
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      throw error;
    }
  },

  /**
   * Fetch order growth statistics for line chart
   * @returns Promise with order growth data
   */
  getOrderGrowthStatistics: async (): Promise<OrderGrowthStatistics> => {
    try {
      const response: AxiosResponse<ApiResponse<OrderGrowthStatistics>> =
        await api.get(API_ENDPOINTS.REPORT.ORDER_GROWTH_LINE_CHART);
      return response.data?.data || response.data?.result || { data: [] };
    } catch (error) {
      console.error("Error fetching order growth statistics:", error);
      throw error;
    }
  },

  /**
   * Fetch top products statistics for pie chart
   * @returns Promise with top products data
   */
  getTopProductStatistics: async (): Promise<TopProductStatistics> => {
    try {
      const response: AxiosResponse<ApiResponse<TopProductStatistics>> =
        await api.get(API_ENDPOINTS.REPORT.TOP_PRODUCT_PIE_CHART);
      return response.data?.data || response.data?.result || { data: [] };
    } catch (error) {
      console.error("Error fetching top product statistics:", error);
      throw error;
    }
  },
};

export default reportService;
