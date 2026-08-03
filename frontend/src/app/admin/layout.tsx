export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f0e2",
        fontFamily: "var(--font-jost), Jost, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
