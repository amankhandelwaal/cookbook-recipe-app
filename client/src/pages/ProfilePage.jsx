import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isAuthenticated = user ? true : false;
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log(isAuthenticated);
      navigate("/auth");
    } else {
      async function fetchUserDetails() {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:3000/user/${user.username}`,
            {
              headers: {
                Authorization: `Bearer ${user.jwt}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }

          const data = await response.json();
          setUserDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }

      fetchUserDetails();
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[300px] mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent>
            <p className="text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${userDetails?.username}`}
                alt={userDetails?.username}
              />
              <AvatarFallback>
                {userDetails?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {userDetails?.username}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {userDetails?.email}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
