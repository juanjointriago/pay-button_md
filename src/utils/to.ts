import axios from "axios";

type Result<T> = [error: Error, result: null] | [null, result: T];

export const to = async <T>(promise: Promise<any>): Promise<Result<T>> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    if (error instanceof Error) return [error, null];

    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.error_message || error.response?.data?.message || error.message;
      return [new Error(errMsg, { cause: error }), null];
    }

    const err = error as Error;
    return [new Error(err.message, { cause: error }), null];
  }
}
