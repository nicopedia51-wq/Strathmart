import { RootLayoutClient } from '@/app/layout-client';
import '@/styles/globals.css';

export const metadata = {
  title: 'StrathMart - School Marketplace',
  description: 'Buy and sell products among students. StrathMart school marketplace.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
