import { apiSlice } from "@/store/api/apiSlice";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  joinedAt: string;
}

export interface DashboardStatistics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface TopProduct {
  name: string;
  soldCount: number;
  revenue: number;
}

export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/api/products",
      providesTags: ["Products"],
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `/api/products/${id}`,
      providesTags: ["Products"],
    }),
    getOrders: builder.query<Order[], void>({
      query: () => "/api/orders",
      providesTags: ["Orders"],
    }),
    getCustomers: builder.query<Customer[], void>({
      query: () => "/api/customers",
      providesTags: ["Customers"],
    }),
    getDashboardStatistics: builder.query<DashboardStatistics, void>({
      query: () => "/api/dashboard/statistics",
      providesTags: ["Dashboard"],
    }),
    getRevenueChart: builder.query<ChartDataPoint[], void>({
      query: () => "/api/dashboard/revenue-chart",
      providesTags: ["Dashboard"],
    }),
    getTopProducts: builder.query<TopProduct[], void>({
      query: () => "/api/dashboard/top-products",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetOrdersQuery,
  useGetCustomersQuery,
  useGetDashboardStatisticsQuery,
  useGetRevenueChartQuery,
  useGetTopProductsQuery,
} = shopApi;
