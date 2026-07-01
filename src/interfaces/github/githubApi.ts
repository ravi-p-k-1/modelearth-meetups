export interface CreatedIssueResponse {
  number: number;
  html_url: string;
  node_id: string;
}

export interface GraphQlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface ProjectLookupResponse {
  organization?: {
    projectV2?: {
      id: string;
    } | null;
  } | null;
  user?: {
    projectV2?: {
      id: string;
    } | null;
  } | null;
}
