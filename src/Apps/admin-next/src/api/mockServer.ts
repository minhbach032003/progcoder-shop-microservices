import { createServer, Model, Server } from "miragejs";
import type { ModelDefinition } from "miragejs/-types";
import { API_ENDPOINTS } from "./endpoints";

// MirageJS Model Types
interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
  categoryName: string;
  brandName: string;
  status: string;
  imageUrl: string;
}

interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdDate: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

// Mirage Server configuration interface
interface MakeServerOptions {
  environment?: string;
}

// Request type for routes
interface MirageRequest {
  url: string;
}

// Dashboard statistics response interface
interface DashboardStatisticsResponse {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  growthRate: number;
}

// Paginated response interface
interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

// Define models
type AppModels = {
  product: ModelDefinition<Product>;
  order: ModelDefinition<Order>;
  customer: ModelDefinition<Customer>;
  category: ModelDefinition<Category>;
  brand: ModelDefinition<Brand>;
};

export function makeServer({
  environment = "development",
}: MakeServerOptions = {}): Server {
  // Get API Gateway URL from env to intercept
  const apiGateway: string = process.env.NEXT_PUBLIC_API_GATEWAY || "";

  console.log("Starting MirageJS Mock Server...");
  console.log("Intercepting:", apiGateway);

  return createServer({
    environment,

    models: {
      product: Model as ModelDefinition<Product>,
      order: Model as ModelDefinition<Order>,
      customer: Model as ModelDefinition<Customer>,
      category: Model as ModelDefinition<Category>,
      brand: Model as ModelDefinition<Brand>,
    },

    seeds(server): void {
      // Seed Categories
      server.create("category", {
        id: "1",
        name: "Electronics",
        slug: "electronics",
      });
      server.create("category", {
        id: "2",
        name: "Clothing",
        slug: "clothing",
      });

      // Seed Brands
      server.create("brand", { id: "1", name: "Apple", slug: "apple" });
      server.create("brand", { id: "2", name: "Nike", slug: "nike" });

      // Seed Products
      server.create("product", {
        id: "1",
        name: "iPhone 15 Pro",
        price: 999,
        sku: "IP15P-128",
        stock: 50,
        categoryName: "Electronics",
        brandName: "Apple",
        status: "PUBLISHED",
        imageUrl: "https://placehold.co/100x100?text=iPhone",
      });
      server.create("product", {
        id: "2",
        name: "Nike Air Max",
        price: 129,
        sku: "NAM-001",
        stock: 20,
        categoryName: "Clothing",
        brandName: "Nike",
        status: "PUBLISHED",
        imageUrl: "https://placehold.co/100x100?text=Nike",
      });

      // Seed Orders
      server.create("order", {
        id: "1001",
        orderNo: "ORD-2023-1001",
        customerName: "John Doe",
        totalAmount: 1128,
        status: "COMPLETED",
        createdDate: new Date().toISOString(),
      });
      server.create("order", {
        id: "1002",
        orderNo: "ORD-2023-1002",
        customerName: "Jane Smith",
        totalAmount: 129,
        status: "PENDING",
        createdDate: new Date().toISOString(),
      });

      // Seed Customers (if needed for list)
      server.create("customer", {
        id: "c1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });
    },

    routes(): void {
      // Configure base URL to match axiosInstance
      this.urlPrefix = apiGateway;
      // this.namespace = ""; // If your API has a common prefix like /api

      // Allow unhandled requests to pass through (e.g. Next.js assets)
      this.passthrough((request: MirageRequest) => {
        if (request.url.startsWith("/_next/")) return true;
        if (request.url.startsWith("/__nextjs")) return true;
        return false;
      });

      this.passthrough(); // Pass through everything else not defined below

      // --- Catalog Service ---
      this.get(API_ENDPOINTS.CATALOG.GET_PRODUCTS, (schema) => {
        const products = schema.all("product");
        const response: PaginatedResponse<Product> = {
          items: products.models.map((m) => m.attrs as Product),
          totalCount: products.length,
          pageIndex: 1,
          pageSize: 10,
        };
        return response;
      });

      this.get(API_ENDPOINTS.CATALOG.GET_ALL_PRODUCTS, (schema) => {
        return schema.all("product").models.map((m) => m.attrs as Product);
      });

      // --- Order Service ---
      this.get(API_ENDPOINTS.ORDER.GET_LIST, (schema) => {
        const orders = schema.all("order");
        const response: PaginatedResponse<Order> = {
          items: orders.models.map((m) => m.attrs as Order),
          totalCount: orders.length,
          pageIndex: 1,
          pageSize: 10,
        };
        return response;
      });

      // --- Dashboard Statistics (Mock) ---
      this.get(
        API_ENDPOINTS.REPORT.DASHBOARD_STATISTICS,
        (): DashboardStatisticsResponse => {
          return {
            totalRevenue: 54321,
            totalOrders: 125,
            totalProducts: 45,
            totalCustomers: 89,
            growthRate: 15.5,
          };
        }
      );

      // --- Keycloak Me (Fake) ---
      // this.get('/account/me', () => ({ ... })); // Already handled by KeycloakContext mock
      this.passthrough(`${apiGateway}/account/me`);
      this.passthrough((request: MirageRequest) => {
        return request.url.includes("/account/me");
      });
    },
  });
}
