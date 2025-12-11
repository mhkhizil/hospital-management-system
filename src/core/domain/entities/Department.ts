/**
 * Department Types
 */

/**
 * Department Data Structure
 * Key-value pairs where key is the department code and value is the display name
 */
export interface DepartmentData {
  [key: string]: string;
}

/**
 * Department Response from API
 */
export interface DepartmentResponse {
  message: string;
  data: DepartmentData;
}
