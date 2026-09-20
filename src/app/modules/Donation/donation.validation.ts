import { z } from "zod";
import { PAYMENT_METHODS } from "../../../models/Fee";

export const donationCreateValidation = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  donorName: z.string().min(1, "Donor name is required").max(120),
  donorPhone: z.string().max(40).optional(),
  donorAddress: z.string().max(300).optional(),
  purpose: z.string().max(200).optional(),
  method: z.enum(PAYMENT_METHODS).optional(),
  refNo: z.string().max(80).optional(),
  note: z.string().max(2000).optional(),
  academicYear: z.string().max(20).optional(),
});

export const donationUpdateValidation = donationCreateValidation.partial();
