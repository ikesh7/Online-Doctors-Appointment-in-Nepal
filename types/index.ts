export interface SearchParamsProps {
  searchParams?: { [key: string]: string | undefined };
}

export type DeleteType =
  | "doctor"
  | "staff"
  | "patient"
  | "auditLog"
  | "bill"
  | "payment"
  | "service";
