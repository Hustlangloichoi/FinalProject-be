const { z } = require("zod");

// const validateRequest = (schema) => {
//   return (req, res, next) => {
//     try {
//       const parsedData = schema.parse({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       });

//       req.validatedData = parsedData;
//       next();
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors: error.errors,
//       });
//     }
//   };
// };

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Store validated data on req object without reassigning
      req.validatedData = parsedData;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
  };
};


module.exports = validateRequest;
