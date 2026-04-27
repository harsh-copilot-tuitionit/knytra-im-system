export default function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card">
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
    </div>
  );
}
