/**
 * SignalR Service
 * Manages SignalR connection for real-time notifications
 */

import * as signalR from "@microsoft/signalr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { SignalRNotification, NotificationCallback } from "@/types";

// Helper function to get cookie by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

interface RetryContext {
  previousRetryCount: number;
  elapsedMilliseconds: number;
  retryReason: Error;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000; // 3 seconds
  private callbacks: Map<string, NotificationCallback> = new Map();

  /**
   * Get the SignalR hub URL
   * @returns Hub URL
   */
  getHubUrl(): string {
    const apiGateway = process.env.NEXT_PUBLIC_API_GATEWAY || "";
    const hubPath =
      API_ENDPOINTS.COMMUNICATION?.NOTIFICATION_HUB ||
      "/communication-service/hubs/notifications";
    return `${apiGateway}${hubPath}`;
  }

  /**
   * Get access token from cookie
   * @returns Access token
   */
  getAccessToken(): string | null {
    return getCookie("access_token");
  }

  /**
   * Create and configure SignalR connection
   * @returns SignalR connection
   */
  createConnection(): signalR.HubConnection {
    const hubUrl = this.getHubUrl();
    const token = this.getAccessToken();

    console.log("SignalR: Creating connection to:", hubUrl);
    console.log("SignalR: Token available:", !!token);

    if (!token) {
      console.warn("SignalR: No access token found, connection may fail");
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || "",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext: RetryContext) => {
          // Exponential backoff: 0s, 2s, 10s, 30s, then 30s
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          return 30000;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Setup connection event handlers
    connection.onclose((error?: Error) => {
      this.isConnected = false;
      console.log("SignalR: Connection closed", error);

      if (error) {
        console.error("SignalR: Connection closed due to error", error);
      }
    });

    connection.onreconnecting((error?: Error) => {
      this.isConnected = false;
      console.log("SignalR: Reconnecting...", error);
    });

    connection.onreconnected((connectionId?: string) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log("SignalR: Reconnected with connection ID:", connectionId);
    });

    return connection;
  }

  /**
   * Connect to SignalR hub
   * @returns Promise<void>
   */
  async connect(): Promise<void> {
    if (this.connection && this.isConnected) {
      console.log("SignalR: Already connected");
      return;
    }

    try {
      // Check if token exists before attempting connection
      const token = this.getAccessToken();
      if (!token) {
        console.warn("SignalR: No access token found, skipping connection");
        return;
      }

      // Create new connection if needed
      if (!this.connection) {
        this.connection = this.createConnection();
        this.setupNotificationHandler();
      }

      // Start connection
      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log("SignalR: Connected successfully");
    } catch (error) {
      this.isConnected = false;
      const typedError = error as Error;
      console.error("SignalR: Connection failed", error);

      // Log more details about the error
      if (typedError.message) {
        console.error("SignalR: Error message:", typedError.message);
      }
      if (typedError.stack) {
        console.error("SignalR: Error stack:", typedError.stack);
      }

      // Don't retry if it's an authentication error or negotiation error
      const isNegotiationError =
        typedError.message?.includes("negotiation") ||
        typedError.message?.includes("Failed to fetch");

      if (isNegotiationError) {
        console.error("SignalR: Negotiation failed. This might be due to:");
        console.error("  1. Service not running");
        console.error("  2. CORS configuration issue");
        console.error("  3. Incorrect URL");
        console.error("  4. Network connectivity issue");
        console.error(`SignalR: Hub URL: ${this.getHubUrl()}`);
        // Don't retry on negotiation errors - they won't succeed
        return;
      }

      // Retry connection after delay for other errors
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(
          `SignalR: Retrying connection (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
        );
        setTimeout(() => {
          this.connect();
        }, this.reconnectDelay);
      } else {
        console.error("SignalR: Max reconnection attempts reached");
      }

      throw error;
    }
  }

  /**
   * Setup notification handler
   */
  setupNotificationHandler(): void {
    if (!this.connection) return;

    this.connection.on("ReceiveNotification", (notification: SignalRNotification) => {
      console.log("SignalR: Received notification", notification);
      console.log(
        `SignalR: Calling ${this.callbacks.size} registered callbacks`
      );

      // Call all registered callbacks
      let callbackIndex = 0;
      this.callbacks.forEach((callback, key) => {
        try {
          callbackIndex++;
          console.log(
            `SignalR: Calling callback #${callbackIndex} (key: ${key})`
          );
          callback(notification);
        } catch (error) {
          console.error(
            `SignalR: Error in notification callback (key: ${key})`,
            error
          );
        }
      });
    });
  }

  /**
   * Register callback for notifications with a unique key
   * If key already exists, the old callback will be replaced
   * @param key - Unique key for the callback
   * @param callback - Callback function to handle notifications
   * @returns Unsubscribe function
   */
  onNotificationByKey(key: string, callback: NotificationCallback): () => void {
    if (typeof callback !== "function") {
      console.error("SignalR: Callback must be a function");
      return () => {};
    }

    if (!key || typeof key !== "string") {
      console.error("SignalR: Key must be a non-empty string");
      return () => {};
    }

    // If key already exists, replace old callback
    if (this.callbacks.has(key)) {
      console.warn(`SignalR: Replacing existing callback for key: ${key}`);
    }

    this.callbacks.set(key, callback);
    console.log(
      `SignalR: Callback registered with key: ${key}. Total: ${this.callbacks.size}`
    );

    // Return unsubscribe function
    return () => this.offNotificationByKey(key);
  }

  /**
   * Unregister callback by key
   * @param key - Unique key for the callback
   * @returns True if callback was removed, false otherwise
   */
  offNotificationByKey(key: string): boolean {
    if (this.callbacks.has(key)) {
      this.callbacks.delete(key);
      console.log(
        `SignalR: Callback unregistered for key: ${key}. Total: ${this.callbacks.size}`
      );
      return true;
    }
    console.warn(`SignalR: No callback found for key: ${key}`);
    return false;
  }

  /**
   * Register callback for notifications (legacy method for backward compatibility)
   * Generates a random key internally
   * @param callback - Callback function to handle notifications
   * @returns Unsubscribe function
   */
  onNotification(callback: NotificationCallback): () => void {
    // Generate random key for backward compatibility
    const randomKey = `callback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    return this.onNotificationByKey(randomKey, callback);
  }

  /**
   * Disconnect from SignalR hub
   * @returns Promise<void>
   */
  async disconnect(): Promise<void> {
    if (!this.connection) {
      return;
    }

    try {
      this.callbacks.clear();
      await this.connection.stop();
      this.isConnected = false;
      this.connection = null;
      console.log("SignalR: Disconnected");
    } catch (error) {
      console.error("SignalR: Error disconnecting", error);
      this.connection = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if connected
   * @returns boolean
   */
  getConnected(): boolean {
    return (
      this.isConnected &&
      this.connection?.state === signalR.HubConnectionState.Connected
    );
  }
}

// Create singleton instance
const signalRService = new SignalRService();

export default signalRService;
