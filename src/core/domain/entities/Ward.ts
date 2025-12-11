/**
 * Ward Types
 */

/**
 * Ward Data Structure
 */
export interface WardData {
  name: string;
  rooms: string[];
}

/**
 * Wards Data Structure
 * Key-value pairs where key is the ward code and value is ward data
 */
export interface WardsData {
  [key: string]: WardData;
}

/**
 * Ward Response from API
 */
export interface WardsResponse {
  message: string;
  data: WardsData;
}

/**
 * Rooms Response for Specific Ward
 */
export interface WardRoomsResponse {
  message: string;
  data: string[];
}
