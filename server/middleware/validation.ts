import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

export const validatePatientRegistration: ValidationChain[] = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Valid date of birth is required"),
  body("gender")
    .isIn(["MALE", "FEMALE", "OTHER"])
    .withMessage("Valid gender is required"),
  body("phone")
    .matches(/^\+254[0-9]{9}$/)
    .withMessage("Valid Kenyan phone number is required"),
  body("nationalId").notEmpty().withMessage("National ID is required"),
  body("county").notEmpty().withMessage("County is required"),
  body("emergencyContactName")
    .notEmpty()
    .withMessage("Emergency contact name is required"),
  body("emergencyContactPhone")
    .matches(/^\+254[0-9]{9}$/)
    .withMessage("Valid emergency contact phone is required"),
];

export const validateLogin: ValidationChain[] = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const validateStaffRegistration: ValidationChain[] = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone")
    .matches(/^\+254[0-9]{9}$/)
    .withMessage("Valid Kenyan phone number is required"),
  body("department").notEmpty().withMessage("Department is required"),
  body("position").notEmpty().withMessage("Position is required"),
  body("role")
    .isIn([
      "ADMIN",
      "DOCTOR",
      "NURSE",
      "RECEPTIONIST",
      "PHARMACIST",
      "LAB_TECH",
      "RADIOLOGIST",
      "FINANCE",
      "RESEARCHER",
    ])
    .withMessage("Valid role is required"),
];

export const validateAppointment: ValidationChain[] = [
  body("patientId").isUUID().withMessage("Valid patient ID is required"),
  body("doctorId").isUUID().withMessage("Valid doctor ID is required"),
  body("appointmentDate")
    .isISO8601()
    .withMessage("Valid appointment date is required"),
  body("appointmentTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Valid time format (HH:MM) is required"),
  body("type")
    .isIn([
      "CONSULTATION",
      "FOLLOW_UP",
      "PROCEDURE",
      "EMERGENCY",
      "ROUTINE_CHECKUP",
    ])
    .withMessage("Valid appointment type is required"),
];

export const validatePrescription: ValidationChain[] = [
  body("patientId").isUUID().withMessage("Valid patient ID is required"),
  body("diagnosis").notEmpty().withMessage("Diagnosis is required"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one prescription item is required"),
  body("items.*.drugId").isUUID().withMessage("Valid drug ID is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("items.*.dosage").notEmpty().withMessage("Dosage is required"),
  body("items.*.frequency").notEmpty().withMessage("Frequency is required"),
];

export const validateLabRequest: ValidationChain[] = [
  body("patientId").isUUID().withMessage("Valid patient ID is required"),
  body("testId").isUUID().withMessage("Valid test ID is required"),
  body("urgency")
    .isIn(["ROUTINE", "URGENT", "STAT"])
    .withMessage("Valid urgency level is required"),
];
