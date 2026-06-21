import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">First Name</label>
            <div className="mt-1 h-10 animate-pulse rounded-md bg-muted" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Name</label>
            <div className="mt-1 h-10 animate-pulse rounded-md bg-muted" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="mt-1 h-10 animate-pulse rounded-md bg-muted" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Phone</label>
            <div className="mt-1 h-10 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
