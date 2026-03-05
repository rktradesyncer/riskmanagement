import type { UserAccountAutoLiq } from "../../lib/risk";
import type { IApiErrorResponse } from "../../types/global";
import Joi from "joi";
import { IRequest } from "../../types/global";

export interface IGetRiskRequest extends IRequest {
  query: IRiskQuery;
  params: IRiskParams;
}

export interface ISetRiskRequest extends IRequest {
  params: IRiskParams;
  payload: ISetRiskPayload;
}

export interface IRiskParams {
  accountId: number;
}

export interface IRiskQuery {
  connectionRef: string;
}

export interface ISetRiskPayload {
  connectionRef: string;
  dailyLossAutoLiq?: number;
  dailyProfitAutoLiq?: number;
  weeklyLossAutoLiq?: number;
  weeklyProfitAutoLiq?: number;
  dailyLossAlert?: number;
  dailyLossPercentageAlert?: number;
  marginPercentageAlert?: number;
  dailyLossLiqOnly?: number;
  dailyLossPercentageLiqOnly?: number;
  marginPercentageLiqOnly?: number;
  dailyLossPercentageAutoLiq?: number;
  marginPercentageAutoLiq?: number;
}

export interface IRiskGetResponse {
  success: true;
  autoLiq: UserAccountAutoLiq | null;
  cached: boolean;
}

export interface IRiskSetResponse {
  success: true;
  autoLiq: UserAccountAutoLiq;
}

export type IRiskErrorResponse = IApiErrorResponse;

export const ErrorSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.string().example("Error description"),
  code: Joi.string().optional().example("TOKEN_EXPIRED"),
}).label("ErrorResponse");

export const AutoLiqSchema = Joi.object({
  id: Joi.number().integer().example(37857980),
  dailyLossAutoLiq: Joi.number().allow(null).example(500),
  dailyProfitAutoLiq: Joi.number().allow(null).example(1000),
  weeklyLossAutoLiq: Joi.number().allow(null).optional(),
  weeklyProfitAutoLiq: Joi.number().allow(null).optional(),
  dailyLossAlert: Joi.number().allow(null).optional(),
  dailyLossPercentageAlert: Joi.number().allow(null).optional(),
  marginPercentageAlert: Joi.number().allow(null).optional(),
  dailyLossLiqOnly: Joi.number().allow(null).optional(),
  dailyLossPercentageLiqOnly: Joi.number().allow(null).optional(),
  marginPercentageLiqOnly: Joi.number().allow(null).optional(),
  dailyLossPercentageAutoLiq: Joi.number().allow(null).optional(),
  marginPercentageAutoLiq: Joi.number().allow(null).optional(),
  trailingMaxDrawdown: Joi.number().allow(null).optional(),
  trailingMaxDrawdownLimit: Joi.number().allow(null).optional(),
  trailingMaxDrawdownMode: Joi.string().valid("EOD", "RealTime").allow(null).optional(),
  flattenTimestamp: Joi.string().allow(null).optional(),
  doNotUnlock: Joi.boolean().allow(null).optional(),
  changesLocked: Joi.boolean().allow(null).optional(),
}).unknown(true).label("AutoLiqSettings");
