/**
 * Global Type Definitions
 */

import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Common Types
export interface PaginationParams {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  result?: T;
  error?: string;
  message?: string;
  data?: T;
  errors?: ApiError[];
}

export interface ApiError {
  errorMessage: string;
  details?: string;
}

// Theme Types
export type SkinMode = "default" | "bordered";
export type ContentWidth = "full" | "boxed";
export type MenuLayoutType = "vertical" | "horizontal";
export type NavbarType = "sticky" | "static" | "floating" | "hidden";
export type FooterType = "sticky" | "static" | "hidden";

// Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface AuthState {
  isAuth: boolean;
  user: User | null;
  token: string | null;
}

// Layout Types
export interface LayoutState {
  isRTL: boolean;
  darkMode: boolean;
  isCollapsed: boolean;
  customizer: boolean;
  semiDarkMode: boolean;
  skin: SkinMode;
  contentWidth: ContentWidth;
  type: MenuLayoutType;
  menuHidden: boolean;
  navBarType: NavbarType;
  footerType: FooterType;
  mobileMenu: boolean;
  isMonochrome: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
  slug?: string;
  published: boolean;
  featured: boolean;
  status: number;
  displayStatus?: string;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
  categoryId?: string;
  brandId?: string;
  images?: string[];
  stock?: number;
  // Extended fields from API
  shortDescription?: string;
  longDescription?: string;
  salePrice?: number;
  barcode?: string;
  unit?: string;
  weight?: number;
  categoryIds?: string[];
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  thumbnail?: {
    publicURL?: string;
    fileKey?: string;
  };
  brandName?: string;
  categoryNames?: string[];
  createdOnUtc?: string;
  lastModifiedBy?: string;
  lastModifiedOnUtc?: string;
  isAvaiable?: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  imageUrl?: string;
  isActive: boolean;
  displayOrder?: number;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
  children?: Category[];
  parentName?: string | null;
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: string;
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  isActive: boolean;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateBrandDto {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  isActive?: boolean;
}

export interface UpdateBrandDto extends Partial<CreateBrandDto> {
  id: string;
}

// Order Types
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  items?: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  created?: string;
  modified?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface CreateOrUpdateOrderDto {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: CreateOrderItemDto[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  productName?: string;
  sku?: string;
  quantity: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  location?: string;
  locationId?: string;
  warehouseId?: string;
  reorderLevel?: number;
  reorderQuantity?: number;
  created?: string;
  modified?: string;
}

export interface CreateInventoryItemDto {
  productId: string;
  locationId?: string;
  quantity: number;
  reorderLevel?: number;
  reorderQuantity?: number;
}

export interface UpdateInventoryItemDto extends Partial<CreateInventoryItemDto> {
  id: string;
}

export interface IncreaseStockRequest {
  quantity: number;
  reason?: string;
}

export interface DecreaseStockRequest {
  quantity: number;
  reason?: string;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  description?: string;
  address?: string;
  isActive: boolean;
  created?: string;
  modified?: string;
}

export interface CreateLocationDto {
  name: string;
  description?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateLocationDto extends Partial<CreateLocationDto> {
  id: string;
}

// Inventory History Types
export interface InventoryHistory {
  id: string;
  inventoryItemId: string;
  productName?: string;
  quantityChange: number;
  reason?: string;
  created?: string;
  createdBy?: string;
}

// Reservation Types
export interface InventoryReservation {
  id: string;
  inventoryItemId: string;
  orderId?: string;
  quantity: number;
  reservedUntil?: string;
  status?: string;
  created?: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  status?: string;
  created?: string;
  createdBy?: string;
  modified?: string;
  modifiedBy?: string;
}

export interface CreateCouponDto {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
}

export interface UpdateCouponDto extends Partial<CreateCouponDto> {
  id: string;
}

export interface UpdateValidityPeriodRequest {
  validFrom: string;
  validTo: string;
}

export interface ValidateCouponRequest {
  code: string;
  orderTotal: number;
}

export interface ApplyCouponRequest {
  couponId: string;
  orderId: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  link?: string;
  created?: string;
  userId?: string;
}

// Report Types
export interface DashboardStatistics {
  growth?: number;
  productsSold?: number;
  totalRevenue?: number;
  totalUsers?: number;
}

export interface OrderGrowthDataPoint {
  date: string;
  count: number;
  revenue?: number;
}

export interface OrderGrowthStatistics {
  data: OrderGrowthDataPoint[];
}

export interface TopProductDataPoint {
  productId: string;
  productName: string;
  quantity: number;
  revenue?: number;
}

export interface TopProductStatistics {
  data: TopProductDataPoint[];
}

// Keycloak Types
export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  redirectUri?: string;
}

export interface KeycloakInitOptions {
  onLoad?: "check-sso" | "login-required";
  checkLoginIframe?: boolean;
  pkceMethod?: "S256";
  redirectUri?: string;
  silentCheckSsoRedirectUri?: string;
  scope?: string;
}

export interface KeycloakLoginOptions {
  redirectUri?: string;
  scope?: string;
  [key: string]: unknown;
}

export interface KeycloakLogoutOptions {
  redirectUri?: string;
  [key: string]: unknown;
}

export interface KeycloakTokenParsed {
  sub?: string;
  preferred_username?: string;
  username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  realm_access?: {
    roles?: string[];
  };
  [key: string]: unknown;
}

// SignalR Types
export interface SignalRNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp?: string;
  [key: string]: unknown;
}

export type NotificationCallback = (notification: SignalRNotification) => void;

// API Config Types
export interface ApiRequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}

// Component Props Types
export interface ChildrenProps {
  children: React.ReactNode;
}

export interface ClassNameProps {
  className?: string;
}

export interface LoadingProps {
  isLoading?: boolean;
}

export interface ErrorProps {
  error?: string | null;
}

// react-table Cell and Row Types
export interface TableCellProps<T extends object = object> {
  cell: {
    value: unknown;
    getCellProps: () => Record<string, unknown>;
    render: (type: string) => React.ReactNode;
    column: {
      id: string;
    };
  };
  row: {
    original: T;
    getRowProps: () => Record<string, unknown>;
  };
}

// Select Option Type for react-select
export interface SelectOption {
  value: string;
  label: string;
}

// Product Form Types
export interface ProductFormValues {
  name: string;
  category: SelectOption[];
  brand: string;
  unit: string;
  weight: string | number;
  minQty: string | number;
  tags: string;
  barcode: string;
  color: string;
  size: string;
  shortDescription: string;
  longDescription: string;
  metaTitle: string;
  metaDesc: string;
  price: string | number;
  salePrice: string | number;
  sku: string;
  quantity: string | number;
  qtyWarning: string | number;
}

// Brand Form Types
export interface BrandFormData {
  name: string;
}

// Category Form Types
export interface CategoryFormData {
  name: string;
  description: string;
  parentId: string;
}

// Product List Item Type
export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  categories: string;
  brand: string;
  price: number;
  salePrice: number | null;
  published: boolean;
  featured: boolean;
  image: string;
  status: string;
}

// Status Config Type
export interface StatusConfig {
  label: string;
  class: string;
}

// react-table Types
export interface TableState {
  globalFilter: string;
  pageIndex: number;
  pageSize: number;
}

export interface TableInstance<T extends object = object> {
  getTableProps: () => Record<string, unknown>;
  getTableBodyProps: () => Record<string, unknown>;
  headerGroups: Array<{
    getHeaderGroupProps: () => Record<string, unknown>;
    headers: Array<{
      getHeaderProps: (propGetter?: unknown) => Record<string, unknown>;
      getSortByToggleProps: () => Record<string, unknown>;
      render: (type: string) => React.ReactNode;
      isSorted: boolean;
      isSortedDesc: boolean;
    }>;
  }>;
  page: Array<{
    getRowProps: () => Record<string, unknown>;
    cells: Array<{
      getCellProps: () => Record<string, unknown>;
      render: (type: string) => React.ReactNode;
    }>;
  }>;
  nextPage: () => void;
  previousPage: () => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  pageOptions: number[];
  gotoPage: (page: number) => void;
  pageCount: number;
  setPageSize: (size: number) => void;
  setGlobalFilter: (filter: string | undefined) => void;
  prepareRow: (row: unknown) => void;
  state: TableState;
}
