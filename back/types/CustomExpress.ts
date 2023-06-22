import { Request } from 'express';

export type TypedRequestQuery<T> = Request<object, object, object, T>;
export type TypedRequestBody<T> = Request<object, object, T, object>;
export type TypedRequestParams<T> = Request<T, object, object, object>;

export type TypedRequestBodyQuery<T, U> = Request<object, object, T, U>;

export type TypedRequestParamsBodyQuery<Params, ReqB, ReqQ> = Request<Params, object, ReqB, ReqQ>;

export type TypedRequest<Params, ResB, ReqB, ReqQ> = Request<Params, ResB, ReqB, ReqQ>;