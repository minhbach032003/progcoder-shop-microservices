/**
 * API Endpoints Configuration
 * All endpoints are relative to VITE_API_GATEWAY base URL
 */

// Type for endpoint functions that take an ID parameter
export type EndpointWithId = (id: string) => string;

// Type for endpoint functions that take an order number parameter
export type EndpointWithOrderNo = (orderNo: string) => string;

// Catalog Service Endpoints Interface
export interface CatalogEndpoints {
  GET_PRODUCTS: string;
  GET_ALL_PRODUCTS: string;
  GET_PRODUCT_DETAIL: EndpointWithId;
  CREATE_PRODUCT: string;
  UPDATE_PRODUCT: EndpointWithId;
  DELETE_PRODUCT: EndpointWithId;
  PUBLISH_PRODUCT: EndpointWithId;
  UNPUBLISH_PRODUCT: EndpointWithId;
  GET_CATEGORIES: string;
  GET_CATEGORY_TREE: string;
  GET_CATEGORY_DETAIL: EndpointWithId;
  CREATE_CATEGORY: string;
  UPDATE_CATEGORY: EndpointWithId;
  DELETE_CATEGORY: EndpointWithId;
  GET_BRANDS: string;
  GET_BRAND_DETAIL: EndpointWithId;
  CREATE_BRAND: string;
  UPDATE_BRAND: EndpointWithId;
  DELETE_BRAND: EndpointWithId;
}

// Inventory Service Endpoints Interface
export interface InventoryEndpoints {
  GET_LIST: string;
  GET_ALL: string;
  GET_DETAIL: EndpointWithId;
  CREATE: string;
  UPDATE: EndpointWithId;
  DELETE: EndpointWithId;
  INCREASE_STOCK: EndpointWithId;
  DECREASE_STOCK: EndpointWithId;
  GET_LOCATIONS: string;
  GET_LOCATION: EndpointWithId;
  CREATE_LOCATION: string;
  UPDATE_LOCATION: EndpointWithId;
  DELETE_LOCATION: EndpointWithId;
  GET_HISTORIES: string;
  GET_ALL_RESERVATIONS: string;
}

// Discount Service Endpoints Interface
export interface DiscountEndpoints {
  GET_LIST: string;
  GET_ALL_COUPONS: string;
  GET_DETAIL: EndpointWithId;
  CREATE: string;
  UPDATE: EndpointWithId;
  DELETE: EndpointWithId;
  APPROVE_COUPON: EndpointWithId;
  REJECT_COUPON: EndpointWithId;
  UPDATE_VALIDITY_PERIOD: EndpointWithId;
  VALIDATE: string;
  APPLY: string;
}

// Order Service Endpoints Interface
export interface OrderEndpoints {
  GET_LIST: string;
  GET_ALL: string;
  GET_DETAIL: EndpointWithId;
  CREATE: string;
  UPDATE: EndpointWithId;
  UPDATE_STATUS: EndpointWithId;
  GET_BY_ORDER_NO: EndpointWithOrderNo;
  GET_BY_CURRENT_USER: string;
}

// Report Service Endpoints Interface
export interface ReportEndpoints {
  DASHBOARD_STATISTICS: string;
  ORDER_GROWTH_LINE_CHART: string;
  TOP_PRODUCT_PIE_CHART: string;
}

// Notification Service Endpoints Interface
export interface NotificationEndpoints {
  GET_LIST: string;
  MARK_AS_READ: string;
  GET_ALL: string;
  GET_COUNT_UNREAD: string;
  GET_TOP_10_UNREAD: string;
}

// Communication Service Endpoints Interface
export interface CommunicationEndpoints {
  NOTIFICATION_HUB: string;
}

// Keycloak Endpoints Interface
export interface KeycloakEndpoints {
  GET_ME: string;
}

// Main API Endpoints Interface
export interface ApiEndpoints {
  CATALOG: CatalogEndpoints;
  INVENTORY: InventoryEndpoints;
  DISCOUNT: DiscountEndpoints;
  ORDER: OrderEndpoints;
  REPORT: ReportEndpoints;
  NOTIFICATION: NotificationEndpoints;
  COMMUNICATION: CommunicationEndpoints;
  KEYCLOAK: KeycloakEndpoints;
}

export const API_ENDPOINTS: ApiEndpoints = {
  // Catalog Service
  CATALOG: {
    GET_PRODUCTS: "/catalog-service/admin/products",
    GET_ALL_PRODUCTS: "/catalog-service/admin/products/all",
    GET_PRODUCT_DETAIL: (id: string): string => `/catalog-service/admin/products/${id}`,
    CREATE_PRODUCT: "/catalog-service/admin/products",
    UPDATE_PRODUCT: (id: string): string => `/catalog-service/admin/products/${id}`,
    DELETE_PRODUCT: (id: string): string => `/catalog-service/admin/products/${id}`,
    PUBLISH_PRODUCT: (id: string): string => `/catalog-service/admin/products/${id}/publish`,
    UNPUBLISH_PRODUCT: (id: string): string => `/catalog-service/admin/products/${id}/unpublish`,
    GET_CATEGORIES: "/catalog-service/categories",
    GET_CATEGORY_TREE: "/catalog-service/admin/categories/tree",
    GET_CATEGORY_DETAIL: (id: string): string => `/catalog-service/admin/categories/${id}`,
    CREATE_CATEGORY: "/catalog-service/admin/categories",
    UPDATE_CATEGORY: (id: string): string => `/catalog-service/admin/categories/${id}`,
    DELETE_CATEGORY: (id: string): string => `/catalog-service/admin/categories/${id}`,
    GET_BRANDS: "/catalog-service/brands",
    GET_BRAND_DETAIL: (id: string): string => `/catalog-service/admin/brands/${id}`,
    CREATE_BRAND: "/catalog-service/admin/brands",
    UPDATE_BRAND: (id: string): string => `/catalog-service/admin/brands/${id}`,
    DELETE_BRAND: (id: string): string => `/catalog-service/admin/brands/${id}`,
  },

  // Inventory Service
  INVENTORY: {
    GET_LIST: "/inventory-service/inventory-items",
    GET_ALL: "/inventory-service/inventory-items/all",
    GET_DETAIL: (id: string): string => `/inventory-service/inventory-items/${id}`,
    CREATE: "/inventory-service/inventory-items",
    UPDATE: (id: string): string => `/inventory-service/inventory-items/${id}`,
    DELETE: (id: string): string => `/inventory-service/inventory-items/${id}`,
    INCREASE_STOCK: (id: string): string => `/inventory-service/inventory-items/${id}/stock/increase`,
    DECREASE_STOCK: (id: string): string => `/inventory-service/inventory-items/${id}/stock/decrease`,
    GET_LOCATIONS: "/inventory-service/locations",
    GET_LOCATION: (id: string): string => `/inventory-service/locations/${id}`,
    CREATE_LOCATION: "/inventory-service/locations",
    UPDATE_LOCATION: (id: string): string => `/inventory-service/locations/${id}`,
    DELETE_LOCATION: (id: string): string => `/inventory-service/locations/${id}`,
    GET_HISTORIES: "/inventory-service/histories",
    GET_ALL_RESERVATIONS: "/inventory-service/reservations/all",
  },

  // Discount Service
  DISCOUNT: {
    GET_LIST: "/discount-service/admin/coupons",
    GET_ALL_COUPONS: "/discount-service/admin/coupons/all",
    GET_DETAIL: (id: string): string => `/discount-service/admin/coupons/${id}`,
    CREATE: "/discount-service/admin/coupons",
    UPDATE: (id: string): string => `/discount-service/admin/coupons/${id}`,
    DELETE: (id: string): string => `/discount-service/admin/coupons/${id}`,
    APPROVE_COUPON: (id: string): string => `/discount-service/admin/coupons/${id}/approve`,
    REJECT_COUPON: (id: string): string => `/discount-service/admin/coupons/${id}/reject`,
    UPDATE_VALIDITY_PERIOD: (id: string): string => `/discount-service/admin/coupons/${id}/validity-period`,
    VALIDATE: "/discount-service/coupons/validate",
    APPLY: "/discount-service/coupons/apply",
  },

  // Order Service
  ORDER: {
    GET_LIST: "/order-service/admin/orders",
    GET_ALL: "/order-service/admin/orders/all",
    GET_DETAIL: (id: string): string => `/order-service/admin/orders/${id}`,
    CREATE: "/order-service/admin/orders",
    UPDATE: (id: string): string => `/order-service/admin/orders/${id}`,
    UPDATE_STATUS: (id: string): string => `/order-service/admin/orders/${id}/status`,
    GET_BY_ORDER_NO: (orderNo: string): string => `/order-service/orders/order-no/${orderNo}`,
    GET_BY_CURRENT_USER: "/order-service/orders/me",
  },

  // Report Service
  REPORT: {
    DASHBOARD_STATISTICS: "/report-service/admin/dashboard-statistics",
    ORDER_GROWTH_LINE_CHART: "/report-service/admin/order-growth-statistics",
    TOP_PRODUCT_PIE_CHART: "/report-service/admin/top-product-statistics",
  },

  // Notification Service
  NOTIFICATION: {
    GET_LIST: "/notification-service/notifications",
    MARK_AS_READ: "/notification-service/notifications/read",
    GET_ALL: "/notification-service/notifications/all",
    GET_COUNT_UNREAD: "/notification-service/notifications/unread/count",
    GET_TOP_10_UNREAD: "/notification-service/notifications/unread/top10",
  },

  // Communication Service
  COMMUNICATION: {
    NOTIFICATION_HUB: "/communication-service/hubs/notifications",
  },

  // Keycloak
  KEYCLOAK: {
    GET_ME: "/account/me",
  },
};

export default API_ENDPOINTS;
