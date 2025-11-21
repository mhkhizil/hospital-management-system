import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./constants";
import { TokenManagementService } from "@/core/infrastructure/services/TokenManagementService";

export class HttpClient {
  private readonly client: AxiosInstance;

  constructor(private readonly tokenService: TokenManagementService) {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15_000,
    });

    this.client.interceptors.request.use((config) => {
      const token = this.tokenService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config);
  }
}
