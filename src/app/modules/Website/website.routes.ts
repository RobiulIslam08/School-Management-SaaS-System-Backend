import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../../middleware/authenticate";
import { authorize } from "../../../middleware/authorize";
import { validate } from "../../../middleware/validate";
import { asyncHandler } from "../../../utils/asyncHandler";
import { websiteController } from "./website.controller";
import {
  resultLookupValidation,
  websiteAlbumValidation,
  websiteConfigValidation,
  websiteFileValidation,
  websiteInquiryValidation,
  websiteMediaValidation,
  websitePageUpdateValidation,
  websitePageValidation,
  websitePersonValidation,
  websitePostValidation,
  syllabusOutlineValidation,
} from "./website.validation";

const lookupLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true });
const inquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true });

const router = Router();
const manage = [authenticate, authorize("website:edit")] as const;

router.get("/public/website", asyncHandler(websiteController.site));
router.get("/public/website/pages/:slug", asyncHandler(websiteController.page));
router.get("/public/website/posts/:id", asyncHandler(websiteController.post));
router.get("/public/website/albums/:id", asyncHandler(websiteController.album));
router.get("/public/website/routine", asyncHandler(websiteController.routine));
router.get("/public/website/syllabus", asyncHandler(websiteController.syllabus));
router.get("/public/website/exams", asyncHandler(websiteController.exams));
router.get("/public/website/merit", asyncHandler(websiteController.merit));
router.get("/public/website/files/:id", asyncHandler(websiteController.download));
router.post("/public/website/results", lookupLimiter, validate(resultLookupValidation), asyncHandler(websiteController.lookup));
router.post("/public/website/inquiries", inquiryLimiter, validate(websiteInquiryValidation), asyncHandler(websiteController.inquiry));

router.get("/website", authenticate, authorize("website:view"), asyncHandler(websiteController.admin));
router.get("/website/syllabus", authenticate, authorize("website:view"), asyncHandler(websiteController.syllabusAdmin));
router.put("/website/syllabus", ...manage, validate(syllabusOutlineValidation), asyncHandler(websiteController.saveSyllabus));
router.put("/website/config", ...manage, validate(websiteConfigValidation), asyncHandler(websiteController.saveConfig));
router.post("/website/pages", ...manage, validate(websitePageValidation), asyncHandler(websiteController.createPage));
router.patch("/website/pages/:id", ...manage, validate(websitePageUpdateValidation), asyncHandler(websiteController.updatePage));
router.delete("/website/pages/:id", ...manage, asyncHandler(websiteController.deletePage));
router.post("/website/posts", ...manage, validate(websitePostValidation), asyncHandler(websiteController.createPost));
router.patch("/website/posts/:id", ...manage, validate(websitePostValidation.partial()), asyncHandler(websiteController.updatePost));
router.delete("/website/posts/:id", ...manage, asyncHandler(websiteController.deletePost));
router.post("/website/albums", ...manage, validate(websiteAlbumValidation), asyncHandler(websiteController.createAlbum));
router.patch("/website/albums/:id", ...manage, validate(websiteAlbumValidation.partial()), asyncHandler(websiteController.updateAlbum));
router.delete("/website/albums/:id", ...manage, asyncHandler(websiteController.deleteAlbum));
router.post("/website/media", ...manage, validate(websiteMediaValidation), asyncHandler(websiteController.createMedia));
router.delete("/website/media/:id", ...manage, asyncHandler(websiteController.deleteMedia));
router.post("/website/people", ...manage, validate(websitePersonValidation), asyncHandler(websiteController.createPerson));
router.patch("/website/people/:id", ...manage, validate(websitePersonValidation.partial()), asyncHandler(websiteController.updatePerson));
router.delete("/website/people/:id", ...manage, asyncHandler(websiteController.deletePerson));
router.post("/website/files", ...manage, validate(websiteFileValidation), asyncHandler(websiteController.createFile));
router.delete("/website/files/:id", ...manage, asyncHandler(websiteController.deleteFile));
router.patch("/website/inquiries/:id", ...manage, asyncHandler(websiteController.markInquiry));

export const websiteRouter = router;
