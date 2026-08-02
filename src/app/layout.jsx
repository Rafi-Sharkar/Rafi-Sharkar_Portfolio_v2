import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Rafi Sharkar',
  description: 'Portfolio of Mustakim Billah Rafi — Backend Developer & Full-Stack Engineer.',
  icons: {
    icon: '/photos/Rafi_tab_icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletmanager.com/gtag/js?id=G-KY77208R8K" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KY77208R8K');
            `,
          }}
        />
      </head>
      <body className="bg-dark-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}