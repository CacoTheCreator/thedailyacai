import { ProductMapping } from "@/types/toeat";

/**
 * ⚠️ CRITICAL: Product GUIDs Mapping Configuration
 * 
 * This file maps Daily Acai product IDs to Toeat POS system product GUIDs.
 * 
 * 🔴 BEFORE GOING LIVE:
 * 1. Get real API credentials from Nativo Acai
 * 2. Call GET /api/products endpoint to retrieve actual product GUIDs
 * 3. Replace all PLACEHOLDER_GUID_* values with real GUIDs from Toeat
 * 4. Verify every product has a valid mapping
 * 
 * How to get real GUIDs:
 * ```bash
 * curl -X GET \
 *   -H "Authorization: Bearer {access_token}" \
 *   https://{api_base_url}/api/products
 * ```
 * 
 * The response will contain an array of products with their GUIDs:
 * {
 *   "products": [
 *     {
 *       "guid": "550e8400-e29b-41d4-a716-446655440000",
 *       "name": "Go 10/10",
 *       "category": "bowls",
 *       "price": 5500,
 *       ...
 *     }
 *   ]
 * }
 */

export const PRODUCT_MAPPINGS: ProductMapping[] = [
  // ==================== Bowl Sizes ====================
  {
    dailyAcaiId: "go",
    toeatGuid: "PLACEHOLDER_GUID_GO_10_10", // 🔴 REPLACE WITH REAL GUID
    category: "bowl_size",
    name: "Go 10/10 (290ml)"
  },
  {
    dailyAcaiId: "tipico",
    toeatGuid: "PLACEHOLDER_GUID_TIPICO", // 🔴 REPLACE WITH REAL GUID
    category: "bowl_size",
    name: "Típico (350ml)"
  },
  {
    dailyAcaiId: "clasico",
    toeatGuid: "PLACEHOLDER_GUID_CLASICO", // 🔴 REPLACE WITH REAL GUID
    category: "bowl_size",
    name: "Bowl Clásico de la Suerte (420ml)"
  },

  // ==================== Toppings: Crunch ====================
  {
    dailyAcaiId: "granola-crunchy",
    toeatGuid: "PLACEHOLDER_GUID_GRANOLA_CRUNCHY", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Granola crunchy sin azúcar"
  },
  {
    dailyAcaiId: "granola-avena",
    toeatGuid: "PLACEHOLDER_GUID_GRANOLA_AVENA", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Granola avena miel"
  },
  {
    dailyAcaiId: "cacao-nibs",
    toeatGuid: "PLACEHOLDER_GUID_CACAO_NIBS", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Cacao nibs"
  },

  // ==================== Toppings: Frutas ====================
  {
    dailyAcaiId: "banana",
    toeatGuid: "PLACEHOLDER_GUID_BANANA", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Banana"
  },
  {
    dailyAcaiId: "frutilla",
    toeatGuid: "PLACEHOLDER_GUID_FRUTILLA", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Frutilla"
  },
  {
    dailyAcaiId: "arandanos",
    toeatGuid: "PLACEHOLDER_GUID_ARANDANOS", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Arándanos"
  },
  {
    dailyAcaiId: "mango",
    toeatGuid: "PLACEHOLDER_GUID_MANGO", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Mango"
  },
  {
    dailyAcaiId: "kiwi",
    toeatGuid: "PLACEHOLDER_GUID_KIWI", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Kiwi"
  },
  {
    dailyAcaiId: "pina",
    toeatGuid: "PLACEHOLDER_GUID_PINA", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Piña"
  },

  // ==================== Toppings: Dulces Naturales ====================
  {
    dailyAcaiId: "miel",
    toeatGuid: "PLACEHOLDER_GUID_MIEL", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Miel"
  },
  {
    dailyAcaiId: "mantequilla-mani",
    toeatGuid: "PLACEHOLDER_GUID_MANTEQUILLA_MANI", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Mantequilla de maní"
  },
  {
    dailyAcaiId: "mantequilla-pistachos",
    toeatGuid: "PLACEHOLDER_GUID_MANTEQUILLA_PISTACHOS", // 🔴 REPLACE WITH REAL GUID
    category: "topping",
    name: "Mantequilla de pistachos"
  },
];

/**
 * Helper function to find Toeat GUID by Daily Acai ID
 */
export const getToeatGuid = (dailyAcaiId: string): string | undefined => {
  return PRODUCT_MAPPINGS.find(m => m.dailyAcaiId === dailyAcaiId)?.toeatGuid;
};

/**
 * Helper function to find Daily Acai ID by Toeat GUID
 */
export const getDailyAcaiId = (toeatGuid: string): string | undefined => {
  return PRODUCT_MAPPINGS.find(m => m.toeatGuid === toeatGuid)?.dailyAcaiId;
};
