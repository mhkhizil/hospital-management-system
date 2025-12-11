import type { INrcService } from "@/core/domain/services/INrcService";
import type { INrcRepository } from "@/core/domain/repositories/INrcRepository";
import type {
  NrcCode,
  Citizenship,
  NrcComponents,
  NrcNumber,
} from "@/core/domain/entities/Nrc";

/**
 * NRC Management Service
 * Orchestrates NRC operations
 */
export class NrcManagementService implements INrcService {
  constructor(private readonly nrcRepository: INrcRepository) {}

  /**
   * Get NRC codes and citizenships
   */
  async getNrcCodes(): Promise<{
    codes: NrcCode[];
    citizenships: Citizenship[];
  }> {
    const response = await this.nrcRepository.getNrcCodes();
    return {
      codes: response.data,
      citizenships: response.citizenships,
    };
  }

  /**
   * Parse NRC number into components
   * Format: {code}/{name_en}({citizenship})123456
   * Example: "1/AhGaYa(N)123456"
   */
  parseNrcNumber(nrcNumber: NrcNumber): NrcComponents | null {
    if (!nrcNumber) return null;

    // Regex to match: 1/AhGaYa(N)123456
    const nrcRegex = /^(\d+)\/([A-Za-z]+)\(([NFPTHS])\)(\d{6})$/;
    const match = nrcNumber.match(nrcRegex);

    if (!match) return null;

    const [, code, nameEn, citizenship, number] = match;

    return {
      code,
      nameEn,
      citizenship: citizenship as Citizenship,
      number,
    };
  }

  /**
   * Build NRC number from components
   */
  buildNrcNumber(components: NrcComponents): NrcNumber {
    const { code, nameEn, citizenship, number } = components;
    return `${code}/${nameEn}(${citizenship})${number}`;
  }

  /**
   * Validate NRC number format
   */
  isValidNrcFormat(nrcNumber: NrcNumber): boolean {
    return this.parseNrcNumber(nrcNumber) !== null;
  }

  /**
   * Get citizenship options
   */
  getCitizenshipOptions(): { value: Citizenship; label: string }[] {
    return [
      { value: "N", label: "N (Native)" },
      { value: "F", label: "F (Foreign)" },
      { value: "P", label: "P (Permanent)" },
      { value: "TH", label: "TH (Temporary Hold)" },
      { value: "S", label: "S (Special)" },
    ];
  }
}
