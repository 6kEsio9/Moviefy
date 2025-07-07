import { useAuth } from "@/app/hooks/useAuth";

export default function LogoutPage() {
  const { user, setUser } = useAuth();

  setUser({
    id: -1,
    username: "",
    bio: "",
    pfp: "",
    watchList: { watched: [], isWatching: [], willWatch: [] },
    reviews: [],
  });

  return <p>Logout</p>;
}
