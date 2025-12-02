/**
 * Toeat API Type Definitions
 * Based on BRIEF-001 documentation from CLAUDE.md
 * Official docs: https://developers.toteat.com
 */

// ============= Authentication =============

export interface ToteatAuthRequest {
  client_id: string;
  client_secret: string;
}

export interface ToteatAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// ============= Inventory Management =============

export type InventoryStatus = "IN_STOCK" | "QUANTITY" | "OUT_OF_STOCK";

export interface ToteatInventoryItem {
  guid: string;
  status: InventoryStatus;
  quantity?: number;
}

export interface ToteatInventoryResponse {
  items: ToteatInventoryItem[];
}

// ============= Products/Menu =============

export interface ToteatProduct {
  guid: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  availability: boolean;
  modifiers?: any[];
  inventory?: ToteatInventoryItem;
}

export interface ToteatProductsResponse {
  products: ToteatProduct[];
}

// ============= Shift Status =============

export interface ToteatShiftStatus {
  is_open: boolean;
  shift_id?: string;
  started_at?: string; // ISO 8601 format
}

// ============= Product Mappings =============

export type ProductCategory = "bowl_size" | "topping";

export interface ProductMapping {
  dailyAcaiId: string;
  toeatGuid: string;
  category: ProductCategory;
  name?: string; // For debugging/clarity
}

// ============= Error Handling =============

export interface ToteatApiError {
  status: number;
  message: string;
  retryAfter?: number; // For rate limiting (429 errors)
}

// ============= UI Data Structures =============

export interface BowlSize {
  id: string;
  name: string;
  size: string;
  originalPrice: number;
  price: number;
  description: string;
  popular?: boolean;
  availability: boolean;
  toeatGuid?: string;
}

export interface Topping {
  id: string;
  name: string;
  category: string;
  popular?: boolean;
  emoji?: string;
  availability: boolean;
  toeatGuid?: string;
}
