import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { ROUTES } from "@/lib/constants";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding"];
const AUTH_PAGES = [ROUTES.login, ROUTES.signup, ROUTES.forgotPassword];

/**
 * Refreshes the Supabase session cookie on every matched request and
 * enforces auth boundaries: guests can't reach the dashboard, signed-in
 * users skip the auth pages.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not run code between createServerClient and getUser() —
  // it can cause random logouts by desynchronizing cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && AUTH_PAGES.includes(pathname as (typeof AUTH_PAGES)[number])) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
