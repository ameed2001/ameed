
'use server';

import { z } from 'zod';

// This schema should ideally match or be imported from page.tsx
// type LoginFormValues = { email: string; password: string; };

export interface LoginActionResponse {
  success: boolean;
  message: string;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// Mock user data for simulation - In a real app, this comes from a database
const mockUsersDB = [
  { email: "owner@example.com", password: "password123", role: "Owner", status: "Active" },
  { email: "engineer_approved@example.com", password: "password123", role: "Engineer", status: "Active" },
  { email: "engineer_pending@example.com", password: "password123", role: "Engineer", status: "Pending Approval" },
  { email: "admin@example.com", password: "adminpass", role: "Admin", status: "Active" },
];


export async function loginUserAction(data: { email: string; password: string; }): Promise<LoginActionResponse> {
  console.log("Server Action: loginUserAction called with:", { email: data.email });

  const user = mockUsersDB.find(u => u.email === data.email);

  if (!user || user.password !== data.password) {
    console.log(`Login failed for ${data.email}. Invalid credentials.`);
    return { 
      success: false, 
      message: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      fieldErrors: { email: ["البيانات المدخلة غير صحيحة"], password: ["البيانات المدخلة غير صحيحة"] }
    };
  }

  if (user.role === "Engineer" && user.status === "Pending Approval") {
    console.log(`Engineer ${data.email} login attempt, account pending approval.`);
    return { 
      success: false, 
      message: "حسابك كمهندس لا يزال قيد المراجعة والموافقة من قبل الإدارة. يرجى المحاولة لاحقًا أو التواصل مع الإدارة." 
    };
  }
  
  if (user.status !== "Active") {
     console.log(`User ${data.email} login attempt, account not active (status: ${user.status}).`);
    return { 
      success: false, 
      message: "حسابك غير نشط حاليًا. يرجى التواصل مع الإدارة."
    };
  }

  // Successful login
  let redirectTo = "/"; // Default redirect for Owner
  if (user.role === "Engineer") {
    redirectTo = "/my-projects"; // Engineer dashboard
  } else if (user.role === "Admin") {
    redirectTo = "/admin"; // Admin dashboard
  }

  console.log(`User ${data.email} (Role: ${user.role}) logged in successfully. Redirecting to ${redirectTo}`);
  return { 
    success: true, 
    message: "تم تسجيل الدخول بنجاح!", 
    redirectTo: redirectTo 
  };
}
