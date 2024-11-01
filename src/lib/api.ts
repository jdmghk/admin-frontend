/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, Method } from "axios";
import * as z from "zod";
import { env } from "../../env";

/**
 * Creates an instance of axios with a base URL.
 */
export const client = axios.create({
  baseURL: env.API_BASE_URL,
});

interface BaseResponse<T> {
  status: string;
  message: string;
  response_code: number;
  data: T | null;
}
interface ApiRequestConfig extends AxiosRequestConfig {
  method: Method;
  url: string;
  data?: any;
  params?: any;
  headers?: any;
}

/**
 * A handler function to make an API request and return either a success or error response.
 * It validates only the `data` field of the base response using the provided Zod validator.
 *
 * @param validator - Zod validator for validating the response data field
 * @param config - AxiosRequestConfig for the request
 * @returns - The base response structure with either the validated data or error information
 */
export async function api<T>(
  validator: z.ZodType<T>,
  config: ApiRequestConfig
): Promise<BaseResponse<T>> {
  try {
    const response = await client(config);

    // Assuming the response is of the BaseResponse structure
    const baseResponse: BaseResponse<any> = response.data;

    // Validate the `data` field using the provided Zod schema
    const validatedData = validator.safeParse(baseResponse.data);

    if (validatedData.success) {
      // Return a successful response with validated data
      return {
        ...baseResponse,
        data: validatedData.data,
      };
    } else {
      // If validation fails, return a validation error
      console.log(validatedData.error);

      return {
        response_code: 400,
        status: "error",
        message: "Validation failed for the response data",
        data: null,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle API errors, assuming the error follows BaseErrorResponse format
      const errorResponse: BaseResponse<null> = error.response.data;

      return {
        response_code: errorResponse.response_code,
        status: errorResponse.status,
        message: errorResponse.message,
        data: errorResponse.data,
      };
    } else {
      // Handle other unexpected errors in the same BaseErrorResponse format
      return {
        response_code: 500,
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }
}
