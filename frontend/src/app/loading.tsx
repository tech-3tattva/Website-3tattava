import AyurvedaLoader from '@/components/ui/AyurvedaLoader';

export default function Loading() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f0e2' }}>
      <AyurvedaLoader message="Preparing your ritual…" />
    </div>
  );
}
