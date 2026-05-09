import type { Request, Response } from "express";
import * as model from "../models/action_log_model";

export async function getAll(req: Request, res: Response) {
  const { type, date_from, date_to, page, limit } = req.query as Record<
    string,
    string
  >;

  const filters: model.ActionLogFilters = {
    type: type || undefined,
    date_from: date_from ? new Date(date_from) : undefined,
    date_to: date_to ? new Date(date_to) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  };

  const result = await model.findAll(filters);
  return res.json(result);
}
