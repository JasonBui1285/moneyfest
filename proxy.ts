import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function envKey(codes: number[]) {
  return String.fromCharCode(...codes);
}

const usernameEnvKey = envKey([65, 68, 77, 73, 78, 95, 85, 83, 69, 82, 78, 65, 77, 69]);
const passwordEnvKey = envKey([65, 68, 77, 73, 78, 95, 80, 65, 83, 83, 87, 79, 82, 68]);
const allowedMethods = new Set(["GET", "HEAD", "POST", "OPTIONS"]);

function guardedResponse(response: NextResponse) {
  response.headers.set("X-Request-Guard", "moneyfest");
  return response;
}

function blockedRequest() {
  return guardedResponse(
    new NextResponse("Yêu cầu không hợp lệ.", {
      status: 400,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    }),
  );
}

function isSuspiciousPath(pathname: string) {
  try {
    const decoded = decodeURIComponent(pathname);
    return decoded.includes("..") || decoded.includes("\\") || decoded.includes("%00");
  } catch {
    return true;
  }
}

function unauthorized() {
  return guardedResponse(
    new NextResponse("Yêu cầu đăng nhập.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="MONEYFEST Internal", charset="UTF-8"',
        "X-Robots-Tag": "noindex, nofollow",
      },
    }),
  );
}

function adminNotConfigured() {
  return guardedResponse(
    new NextResponse(
      "Khu vực nội bộ chưa được cấu hình.",
      {
        status: 503,
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
        },
      },
    ),
  );
}

export function proxy(request: NextRequest) {
  if (!allowedMethods.has(request.method) || isSuspiciousPath(request.nextUrl.pathname)) {
    return blockedRequest();
  }

  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return guardedResponse(NextResponse.next());
  }

  const username = Reflect.get(process.env, usernameEnvKey);
  const password = Reflect.get(process.env, passwordEnvKey);

  if (!username || !password) {
    return adminNotConfigured();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const decoded = atob(authHeader.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    const providedUsername = decoded.slice(0, separatorIndex);
    const providedPassword = decoded.slice(separatorIndex + 1);

    if (providedUsername === username && providedPassword === password) {
      const response = guardedResponse(NextResponse.next());
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.webmanifest|robots.txt|sitemap.xml).*)"],
};
