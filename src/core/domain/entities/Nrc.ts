/**
 * NRC Types
 */

/**
 * NRC Code Data Structure
 */
export interface NrcCode {
  id: string;
  name_en: string;
  name_mm: string;
  nrc_code: string;
}

/**
 * Citizenship Types
 */
export type Citizenship = "N" | "F" | "P" | "TH" | "S";

/**
 * NRC Components
 */
export interface NrcComponents {
  code: string;
  nameEn: string;
  citizenship: Citizenship;
  number: string;
}

/**
 * NRC Response from API
 */
export interface NrcCodesResponse {
  message: string;
  citizenships: Citizenship[];
  data: NrcCode[];
}

/**
 * NRC Number Format: {code}/{name_en}({citizenship})123456
 */
export type NrcNumber = string;
