export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0f0f0f",
        overflowY: "auto",
        fontFamily: "var(--font-jost), Jost, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
