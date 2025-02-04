type RouteAccessProps = {
  [key: string]: string[];
};

export const routeAccess: RouteAccessProps = {
  "/admin(.*)": ["admin"],
  "/patient(.*)": ["patient", "admin", "doctor", "nurse"],
  "/doctor(.*)": ["doctor"],
  "/staff(.*)": ["nurse", "cashier"],
  "/record/users": ["admin"],
  "/record/doctors": ["admin"],
  "/record/doctors(.*)": ["admin", "doctor"],
  "/record/staffs": ["admin", "doctor"],
  "/record/patients": ["admin", "doctor", "nurse", "laboratory"],
  "/record/leaves": ["doctor", "nurse", "laboratory"],
  "/patient/registration": ["patient"],
};
