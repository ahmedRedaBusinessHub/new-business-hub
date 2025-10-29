export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          Welcome to Enterprise App
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
