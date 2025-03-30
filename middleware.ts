// import { NextRequest, NextResponse } from 'next/server';
// import { pathnames, ROUTES_KEY } from './src/constants/routes';

// export function middleware(req: NextRequest) {
// //   const { pathname, search } = req.nextUrl;

// //   // Get the default route for the landing page based on locale
// //   const landingPath = pathnames[ROUTES_KEY.MESSAGE] || '/';

// //   // Redirect "/" to the localized landing page
// //   if (pathname === '/') {
// //     return NextResponse.redirect(new URL(landingPath + search, req.url));
// //   }

// //   return NextResponse.next();

// if (req.nextUrl.pathname === '/') {
//     return NextResponse.rewrite(new URL('/chats/', req.url)); // 🔄 Rewrite, not redirect
//   }
//   return NextResponse.next();
// }

// // Apply middleware to all routes
// export const config = {
//   matcher: ['/'], // Adjust this to match specific routes if needed
// };
