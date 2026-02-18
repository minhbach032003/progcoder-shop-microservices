/**
 * API Module
 * Central export for all API related functionality
 */

export { 
  default as axiosInstance, 
  api, 
  keycloakApi,
  type ApiErrorDetail,
  type ApiErrorResponse,
  type CustomAxiosRequestConfig,
} from "./axiosInstance";

export { 
  API_ENDPOINTS, 
  default as endpoints,
  type ApiEndpoints,
  type CatalogEndpoints,
  type InventoryEndpoints,
  type DiscountEndpoints,
  type OrderEndpoints,
  type ReportEndpoints,
  type NotificationEndpoints,
  type CommunicationEndpoints,
  type KeycloakEndpoints,
  type EndpointWithId,
  type EndpointWithOrderNo,
} from "./endpoints";

export { makeServer } from "./mockServer";
