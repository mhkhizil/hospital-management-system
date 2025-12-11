import type { NrcCodesResponse } from "../entities/Nrc";

/**
 * NRC Repository Interface
 * Defines contract for fetching NRC data
 */
export interface INrcRepository {
  /**
   * Get NRC codes and citizenships
   * @returns NRC codes and allowed citizenships
   */
  getNrcCodes(): Promise<NrcCodesResponse>;
}
