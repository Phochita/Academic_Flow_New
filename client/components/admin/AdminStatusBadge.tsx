type AdminStatusBadgeProps = {
  status: string;
};

const getStatusClasses = (status: string) => {
  const value = status.toLowerCase();

  if (value.includes('active') || value.includes('healthy') || value.includes('resolved') || value.includes('on track')) {
    return 'bg-[#e9fbf1] text-[#1e8a4d]';
  }

  if (value.includes('warning') || value.includes('review') || value.includes('trial') || value.includes('watchlist')) {
    return 'bg-[#fff6e7] text-[#ad6a00]';
  }

  if (value.includes('critical') || value.includes('suspended') || value.includes('past due') || value.includes('overdue') || value.includes('cancelled')) {
    return 'bg-[#fff0f3] text-[#be375d]';
  }

  if (value.includes('audit') || value.includes('open') || value.includes('pending')) {
    return 'bg-[#eef3ff] text-[#415fd5]';
  }

  return 'bg-[#f2ebff] text-[#6d38de]';
};

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(status)}`}>
      {status}
    </span>
  );
}
