import type { Account } from "../../lib/accounts";
import type { IApiErrorResponse } from "../../types/global";
import { IRequest } from "../../types/global";
import Joi from "joi";

export interface IGetAccountsRequest extends IRequest {
  query: IAccountsQuery;
}

export interface IAccountsQuery {
  connectionRef: string;
}

export interface IAccountsResponse {
  success: true;
  accounts: Account[];
}

export type IAccountsErrorResponse = IApiErrorResponse;

export const ErrorSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.string().example("Error description"),
  code: Joi.string().optional().example("TOKEN_EXPIRED"),
}).label("ErrorResponse");

export const AccountSchema = Joi.object({
  id: Joi.number().integer().example(37857980),
  name: Joi.string().example("MFFUEVPRO203682060"),
  userId: Joi.number().integer().example(150234),
  accountType: Joi.string().example("Customer"),
  active: Joi.boolean().example(true),
  clearingHouseId: Joi.number().integer().optional(),
  riskCategoryId: Joi.number().integer().optional(),
  autoLiqProfileId: Joi.number().integer().optional(),
  marginAccountType: Joi.string().optional().example("Speculator"),
  legalStatus: Joi.string().optional().example("Individual"),
}).unknown(true).label("Account");