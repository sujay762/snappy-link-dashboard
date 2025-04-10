
import { useAuth } from "@/contexts/AuthContext";

const UserStats = () => {
  const { totalUsers } = useAuth();

  return (
    <div className="text-center mb-6">
      <h2 className="text-xl font-semibold mb-2">Community Stats</h2>
      <p className="text-muted-foreground">
        Join our growing community of <span className="font-bold text-black">{totalUsers}</span> users already shortening their links!
      </p>
    </div>
  );
};

export default UserStats;
