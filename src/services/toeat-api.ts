/**
 * Toeat API Service
 * 
 * Handles all communication with Toeat POS API including:
 * - OAuth 2.0 authentication
 * - Inventory status queries
 * - Product/menu retrieval
 * - Shift status monitoring
 * 
 * Based on BRIEF-001 documentation in CLAUDE.md
 * Official API docs: https://developers.toteat.com
 * 
 * ⚠️ SECURITY REQUIREMENTS:
 * - All credentials MUST be in environment variables (never hardcoded)
 * - Tokens stored in memory only (never localStorage)
 * - All requests over HTTPS
 * - Rate limiting awareness (429 errors)
 */

import {
  ToteatAuthResponse,
  ToteatInventoryResponse,
  ToteatProductsResponse,
  ToteatShiftStatus,
  ToteatProduct,
  ToteatInventoryItem,
  ToteatApiError,
  BowlSize,
  Topping
} from "@/types/toeat";
import { PRODUCT_MAPPINGS } from "@/config/toeat-mappings";

// ============= Configuration =============

const API_CONFIG = {
  baseUrl: import.meta.env.VITE_TOEAT_API_BASE_URL || "https://api.toteat.com",
  clientId: import.meta.env.VITE_TOEAT_CLIENT_ID || "",
  clientSecret: import.meta.env.VITE_TOEAT_CLIENT_SECRET || "",
  restaurantId: import.meta.env.VITE_TOEAT_RESTAURANT_ID || "",
  localId: import.meta.env.VITE_TOEAT_LOCAL_ID || "",
};

// In-memory token storage (more secure than localStorage)
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// ============= Error Handling =============

export class ToteatError extends Error {
  constructor(
    message: string,
    public status?: number,
    public retryAfter?: number
  ) {
    super(message);
    this.name = "ToteatError";
  }
}

// ============= Retry Logic with Exponential Backoff =============

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on authentication errors (401) or bad requests (400)
      if (error instanceof ToteatError && (error.status === 401 || error.status === 400)) {
        throw error;
      }

      // If it's the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Wait with exponential backoff before retrying
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`Toeat API attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// ============= Authentication =============

/**
 * Authenticate with Toeat API using OAuth 2.0
 * Caches token in memory for subsequent requests
 */
export async function authenticateWithToeat(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!API_CONFIG.clientId || !API_CONFIG.clientSecret) {
    throw new ToteatError(
      "Toeat API credentials not configured. Please set VITE_TOEAT_CLIENT_ID and VITE_TOEAT_CLIENT_SECRET environment variables.",
      401
    );
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: API_CONFIG.clientId,
        client_secret: API_CONFIG.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new ToteatError(
        `Authentication failed: ${response.statusText}`,
        response.status
      );
    }

    const data: ToteatAuthResponse = await response.json();
    
    // Cache token with 5 minute buffer before actual expiry
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
    
    return data.access_token;
  } catch (error) {
    if (error instanceof ToteatError) throw error;
    throw new ToteatError(`Failed to authenticate with Toeat: ${(error as Error).message}`);
  }
}

// ============= Inventory Status =============

/**
 * Get real-time inventory status for all products
 */
export async function getInventoryStatus(token: string): Promise<ToteatInventoryItem[]> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/inventory`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
      throw new ToteatError(
        `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
        429,
        retryAfter
      );
    }

    if (!response.ok) {
      throw new ToteatError(
        `Failed to fetch inventory: ${response.statusText}`,
        response.status
      );
    }

    const data: ToteatInventoryResponse = await response.json();
    return data.items;
  } catch (error) {
    if (error instanceof ToteatError) throw error;
    throw new ToteatError(`Inventory request failed: ${(error as Error).message}`);
  }
}

// ============= Products/Menu =============

/**
 * Get complete product catalog with pricing and availability
 */
export async function getProducts(token: string): Promise<ToteatProduct[]> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/products`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
      throw new ToteatError(
        `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
        429,
        retryAfter
      );
    }

    if (!response.ok) {
      throw new ToteatError(
        `Failed to fetch products: ${response.statusText}`,
        response.status
      );
    }

    const data: ToteatProductsResponse = await response.json();
    return data.products;
  } catch (error) {
    if (error instanceof ToteatError) throw error;
    throw new ToteatError(`Products request failed: ${(error as Error).message}`);
  }
}

// ============= Shift Status =============

/**
 * Check if store is currently open and accepting orders
 */
export async function getShiftStatus(token: string): Promise<ToteatShiftStatus> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/api/shiftstatus`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new ToteatError(
        `Failed to fetch shift status: ${response.statusText}`,
        response.status
      );
    }

    const data: ToteatShiftStatus = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ToteatError) throw error;
    throw new ToteatError(`Shift status request failed: ${(error as Error).message}`);
  }
}

// ============= Data Transformation =============

/**
 * Transform Toeat products into BowlBuilder UI format
 * Filters out unavailable products and maps prices/stock status
 */
export function mapToeatProductsToBowlBuilder(
  toeatProducts: ToteatProduct[],
  inventory: ToteatInventoryItem[]
): {
  bowlSizes: BowlSize[];
  toppings: Topping[];
} {
  // Default data structure matching current hardcoded values
  const defaultBowlSizes: BowlSize[] = [
    {
      id: "go",
      name: "Go 10/10",
      size: "290 ml",
      originalPrice: 6500,
      price: 5500,
      description: "Toppings infinitos",
      availability: true,
    },
    {
      id: "tipico",
      name: "Típico",
      size: "350 ml",
      originalPrice: 7600,
      price: 6500,
      description: "El equilibrio perfecto",
      popular: true,
      availability: true,
    },
    {
      id: "clasico",
      name: "Bowl Clásico de la Suerte",
      size: "420 ml",
      originalPrice: 9100,
      price: 7700,
      description: "Máxima indulgencia",
      availability: true,
    },
  ];

  const defaultToppings: Topping[] = [
    // Crunch
    { id: "granola-crunchy", name: "Granola crunchy sin azúcar", category: "🥣 Crunch", availability: true },
    { id: "granola-avena", name: "Granola avena miel", category: "🥣 Crunch", availability: true },
    { id: "cacao-nibs", name: "Cacao nibs", category: "🥣 Crunch", availability: true },
    // Frutas
    { id: "banana", name: "Banana", category: "🍓 Frutas", availability: true },
    { id: "frutilla", name: "Frutilla", category: "🍓 Frutas", availability: true },
    { id: "arandanos", name: "Arándanos", category: "🍓 Frutas", availability: true },
    { id: "mango", name: "Mango", category: "🍓 Frutas", availability: true },
    { id: "kiwi", name: "Kiwi", category: "🍓 Frutas", availability: true },
    { id: "pina", name: "Piña", category: "🍓 Frutas", availability: true },
    // Dulces Naturales
    { id: "miel", name: "Miel", category: "🍬 Dulces Naturales", availability: true },
    { id: "mantequilla-mani", name: "Mantequilla de maní", category: "🍬 Dulces Naturales", availability: true },
    { id: "mantequilla-pistachos", name: "Mantequilla de pistachos", category: "🍬 Dulces Naturales", availability: true },
  ];

  // If no products from Toeat, return defaults with full availability
  if (!toeatProducts || toeatProducts.length === 0) {
    console.warn("No Toeat products found, using default data");
    return { bowlSizes: defaultBowlSizes, toppings: defaultToppings };
  }

  // Map bowl sizes
  const bowlSizes = defaultBowlSizes.map(defaultBowl => {
    const mapping = PRODUCT_MAPPINGS.find(
      m => m.dailyAcaiId === defaultBowl.id && m.category === "bowl_size"
    );
    
    if (!mapping) return defaultBowl;

    const toeatProduct = toeatProducts.find(p => p.guid === mapping.toeatGuid);
    const inventoryItem = inventory.find(i => i.guid === mapping.toeatGuid);

    if (!toeatProduct) return defaultBowl;

    // Calculate 15% discount for app pricing
    const originalPrice = toeatProduct.price;
    const discountedPrice = Math.round(originalPrice * 0.85);

    return {
      ...defaultBowl,
      price: discountedPrice,
      originalPrice: originalPrice,
      availability: inventoryItem?.status !== "OUT_OF_STOCK",
      toeatGuid: toeatProduct.guid,
    };
  });

  // Map toppings
  const toppings = defaultToppings.map(defaultTopping => {
    const mapping = PRODUCT_MAPPINGS.find(
      m => m.dailyAcaiId === defaultTopping.id && m.category === "topping"
    );
    
    if (!mapping) return defaultTopping;

    const toeatProduct = toeatProducts.find(p => p.guid === mapping.toeatGuid);
    const inventoryItem = inventory.find(i => i.guid === mapping.toeatGuid);

    if (!toeatProduct) return defaultTopping;

    return {
      ...defaultTopping,
      availability: inventoryItem?.status !== "OUT_OF_STOCK",
      toeatGuid: toeatProduct.guid,
    };
  });

  return { bowlSizes, toppings };
}

// ============= Complete Product Load =============

/**
 * Complete product loading workflow with authentication, inventory, and products
 */
export async function loadProductsFromToeat(): Promise<{
  bowlSizes: BowlSize[];
  toppings: Topping[];
  isStoreOpen: boolean;
  lastUpdated: Date;
}> {
  try {
    // Step 1: Authenticate
    const token = await fetchWithRetry(() => authenticateWithToeat());

    // Step 2: Check shift status
    const shiftStatus = await fetchWithRetry(() => getShiftStatus(token));

    // Step 3: Load inventory and products in parallel
    const [inventory, products] = await Promise.all([
      fetchWithRetry(() => getInventoryStatus(token)),
      fetchWithRetry(() => getProducts(token))
    ]);

    // Step 4: Transform data
    const { bowlSizes, toppings } = mapToeatProductsToBowlBuilder(products, inventory);

    return {
      bowlSizes,
      toppings,
      isStoreOpen: shiftStatus.is_open,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Failed to load products from Toeat:", error);
    throw error;
  }
}
