import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-background">
      {/* Aesthetic Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-pulse-slow -z-10" style={{ animationDelay: '1s' }} />
      <div className="fixed top-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[80px] animate-float -z-10" />

      <Header />
      <main className="flex-1 relative z-0">{children}</main>
      <Footer />
    </div>
  );
}
