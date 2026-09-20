export type NoticeAudience = "all" | "teachers" | "students" | "guardians" | "class";

export type NoticeCategory = "general" | "exam" | "holiday" | "fee" | "admission" | "other";

export type NoticeSignatoryInput = {
  name: string;
  designation: string;
};

export type NoticeCreateBody = {
  title: string;
  body: string;
  audience?: NoticeAudience;
  classId?: string;
  isPublished?: boolean;
  refNo?: string;
  issueDate?: string;
  category?: NoticeCategory;
  signatories?: NoticeSignatoryInput[];
  showOnWebsite?: boolean;
  pinned?: boolean;
};
