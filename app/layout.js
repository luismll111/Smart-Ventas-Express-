import "./globals.css";
export const metadata = { title: "Smart Ventas Express", description: "Demo UI" };
export default function RootLayout({ children }) {
  return (<html lang="es"><body className="antialiased">{children}</body></html>);
}
