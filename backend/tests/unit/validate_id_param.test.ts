import type { Request, Response, NextFunction } from "express";
import { validateIdParam } from "../../src/middlewares/validate_id_param";
import { ApiError } from "../../src/middlewares/error_middleware";

describe("validateIdParam middleware", () => {
	const mockRes = {} as Response;
	const mockNext = jest.fn() as NextFunction;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should call next() for valid numeric id", () => {
		const req = { params: { id: "42" } } as unknown as Request;
		validateIdParam()(req, mockRes, mockNext);
		expect(mockNext).toHaveBeenCalled();
	});

	it("should throw ApiError for non-numeric id", () => {
		const req = { params: { id: "abc" } } as unknown as Request;
		expect(() => validateIdParam()(req, mockRes, mockNext)).toThrow(ApiError);
	});

	it("should throw ApiError for missing id", () => {
		const req = { params: {} } as unknown as Request;
		expect(() => validateIdParam()(req, mockRes, mockNext)).toThrow(ApiError);
	});

	it("should work with custom param name", () => {
		const req = { params: { userId: "5" } } as unknown as Request;
		validateIdParam("userId")(req, mockRes, mockNext);
		expect(mockNext).toHaveBeenCalled();
	});
});
