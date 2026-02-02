export enum EmailType {
  GROUP_PUBLISHED = 'group_published',
  REPORT_APPROVED = 'report_approved',
  REPORT_REJECTED = 'report_rejected',
  REPORT_UNDER_REVIEW = 'report_under_review',
  SUBMISSION_ACTIVE = 'submission_active',
}

export interface EmailPayload {
  type: EmailType;
  to: string;
  subject: string;
  data: Record<string, any>;
}

export interface GroupPublishedEmailData {
  studentName: string;
  groupName: string;
  email: string;
  password: string;
  advisorName: string;
  advisorEmail?: string;
  coAdvisorName?: string;
  coAdvisorEmail?: string;
  courseCode: string;
  studentRA?: string;
}

export interface ReportApprovedEmailData {
  groupName: string;
  score: number;
  submissionName: string;
  observations?: string;
}

export interface ReportRejectedEmailData {
  groupName: string;
  score: number;
  submissionName: string;
  observations?: string;
  reasons: string[];
}

export interface ReportUnderReviewEmailData {
  groupName: string;
  submissionName: string;
}

export interface SubmissionActiveEmailData {
  submissionName: string;
  deadlineDate: Date;
  description?: string;
}
