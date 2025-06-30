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
      quantity: z.number().int().min(0).optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().length(24, "Invalid product id format"),
    }),
    body: z.object({
      name: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      quantity: z.number().int().min(0).optional(),
    }),
  }),
};

const categorySchemas = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().length(24, "Invalid category id format"),
    }),
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    }),
  }),
};

const orderSchemas = {
  create: z.object({
    body: z.object({
      note: z.string().optional(),
      quantity: z.number().int().positive(),
      paymentMethod: z.enum(["Momo e-wallet", "Mb bank", "COD"]),
      paymentDetails: z.string().optional(),
      phoneNumber: z.string().min(1, "Phone number is required"),
      address: z.string().min(1, "Address is required"),
    }),
  }),
  delete: z.object({
    params: z.object({
      id: z.string().length(24, "Invalid order id format"),
    }),
  }),
  updateStatus: z.object({
    params: z.object({
      id: z.string().length(24, "Invalid order id format"),
    }),
    body: z.object({
      status: z.enum(["pending", "completed"], {
        errorMap: () => ({
          message: "Status must be either 'pending' or 'completed'",
        }),
      }),
    }),
  }),
};

const userSchemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters"),
    }),
  }),
  adminCreate: z.object({
    body: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      isAdmin: z.boolean().optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().length(24, "Invalid user id format"),
    }),
    body: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      isAdmin: z.boolean().optional(),
    }),
  }),
};

const meSchemas = {
  updateInfo: z.object({
    body: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    }),
  }),
  changePassword: z.object({
    body: z.object({
      currentPassword: z
        .string()
        .min(6, "Current password must be at least 6 characters"),
      newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters"),
    }),
  }),
};

const messageSchemas = {
  create: z.object({
    body: z.object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
      email: z.string().email("Invalid email format"),
      subject: z
        .string()
        .min(1, "Subject is required")
        .max(200, "Subject must be less than 200 characters"),
      message: z
        .string()
        .min(5, "Message must be at least 5 characters")
        .max(2000, "Message must be less than 2000 characters"),
      phoneNumber: z.string().optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().length(24, "Invalid message id format"),
    }),
    body: z.object({
      isRead: z.boolean().optional(),
      adminNotes: z.string().optional(),
      repliedAt: z.string().optional(),
    }),
  }),
  delete: z.object({
    params: z.object({
      id: z.string().length(24, "Invalid message id format"),
    }),
  }),
  markAsRead: z.object({
    params: z.object({
      id: z.string().length(24, "Invalid message id format"),
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
  messageSchemas,
};
