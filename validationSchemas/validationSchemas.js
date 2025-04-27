const { z } = require("zod");

const authSchemas = {
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  }),
};

const productSchemas = {
  create: z.object({
    body: z.object({
      name: z.string().min(1),
      price: z.number().positive(),
    }),
  }),
};

const categorySchemas = {
  update: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    }),
  }),
};

const orderSchemas = {
  create: z.object({
    params: z.object({
      productId: z.string().uuid(),
    }),
    body: z.object({
      content: z.string().min(1, "Content is required"),
    }),
  }),
  delete: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
};

const userSchemas = {
  register: z.object({
    // move to authSchemas.js
    body: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters"),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    }),
  }),
};

const meSchemas = {
  updateInfo: z.object({
    body: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
    }),
  }),
};

module.exports = {
  authSchemas,
  productSchemas,
  categorySchemas,
  orderSchemas,
  userSchemas,
  meSchemas,
};
