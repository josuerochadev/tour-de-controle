import { login, resetPassword } from "../../src/schemas/authentication_schema";
import { closeSchema } from "../../src/schemas/cash_register_schema";
import {
  filterSchema,
  createSchema as txCreateSchema,
} from "../../src/schemas/transaction_schema";
import { createSchema, updateSchema } from "../../src/schemas/user_schema";

describe("user_schema", () => {
  describe("createSchema", () => {
    const validUser = {
      first_name: "Jean",
      last_name: "Dupont",
      email: "jean@test.com",
      password: "Password1",
      hire_date: "2024-01-01",
      id_role: 4,
    };

    it("should accept valid user data", () => {
      expect(() => createSchema.parse(validUser)).not.toThrow();
    });

    it("should reject short first_name", () => {
      expect(() =>
        createSchema.parse({ ...validUser, first_name: "J" }),
      ).toThrow();
    });

    it("should reject invalid email", () => {
      expect(() =>
        createSchema.parse({ ...validUser, email: "invalid" }),
      ).toThrow();
    });

    it("should reject weak password (no uppercase)", () => {
      expect(() =>
        createSchema.parse({ ...validUser, password: "password1" }),
      ).toThrow();
    });

    it("should reject weak password (no digit)", () => {
      expect(() =>
        createSchema.parse({ ...validUser, password: "Password" }),
      ).toThrow();
    });

    it("should reject short password", () => {
      expect(() =>
        createSchema.parse({ ...validUser, password: "Pa1" }),
      ).toThrow();
    });

    it("should accept valid French phone number", () => {
      expect(() =>
        createSchema.parse({ ...validUser, phone_number: "0612345678" }),
      ).not.toThrow();
    });

    it("should reject invalid phone number", () => {
      expect(() =>
        createSchema.parse({ ...validUser, phone_number: "123" }),
      ).toThrow();
    });
  });

  describe("updateSchema", () => {
    it("should accept partial user data", () => {
      expect(() => updateSchema.parse({ first_name: "Marie" })).not.toThrow();
    });

    it("should accept empty object", () => {
      expect(() => updateSchema.parse({})).not.toThrow();
    });
  });
});

describe("transaction_schema", () => {
  describe("createSchema", () => {
    it("should accept valid transaction", () => {
      expect(() =>
        txCreateSchema.parse({
          amount: 15.5,
          id_payment_type: 1,
          id_cash_register: 1,
          created_by: 1,
        }),
      ).not.toThrow();
    });

    it("should reject negative amount", () => {
      expect(() =>
        txCreateSchema.parse({
          amount: -5,
          id_payment_type: 1,
          id_cash_register: 1,
          created_by: 1,
        }),
      ).toThrow();
    });
  });

  describe("filterSchema", () => {
    it("should accept empty query", () => {
      expect(() => filterSchema.parse({})).not.toThrow();
    });

    it("should transform string page to number", () => {
      const result = filterSchema.parse({ page: "2" });
      expect(result.page).toBe(2);
    });
  });
});

describe("authentication_schema", () => {
  it("should accept valid login", () => {
    expect(() =>
      login.parse({ email: "test@test.com", password: "Password1" }),
    ).not.toThrow();
  });

  it("should reject login without email", () => {
    expect(() => login.parse({ password: "Password1" })).toThrow();
  });

  it("should accept valid reset password", () => {
    expect(() =>
      resetPassword.parse({ token: "abc", password: "Password1" }),
    ).not.toThrow();
  });
});

describe("cash_register_schema", () => {
  it("should accept valid close data", () => {
    expect(() =>
      closeSchema.parse({
        funds: [{ id_payment_type: 1, physical_amount: 100 }],
      }),
    ).not.toThrow();
  });

  it("should reject close without funds", () => {
    expect(() => closeSchema.parse({})).toThrow();
  });
});
