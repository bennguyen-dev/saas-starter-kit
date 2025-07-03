import { DashboardHeader, DashboardMain } from "@/shared/components/layouts";
import { ProfileDropdown } from "@/features/auth";

export default function DashboardPage() {
  const user = {
    name: "John Doe",
    email: "6Kt0P@example.com",
    avatar: "https://github.com/brunorocha.png",
  };

  return (
    <>
      <DashboardHeader>
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown user={user} side="bottom" />
        </div>
      </DashboardHeader>
      <DashboardMain>Dashboard</DashboardMain>
    </>
  );
}
