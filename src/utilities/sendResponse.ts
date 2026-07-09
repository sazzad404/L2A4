import { Response } from "express";

export interface TMeta {
  page: number;
  limit: number;
  total: number;
}

export interface TResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: TMeta;
}

const sendResponse = <T>(
  res: Response,
  payload: TResponse<T>
): void => {
  const { statusCode, ...responseData } = payload;

  res.status(statusCode).json(responseData);
};

export default sendResponse;