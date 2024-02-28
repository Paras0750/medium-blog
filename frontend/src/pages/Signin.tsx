import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) return;

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/signin`,
      {
        email,
        password,
      }
    );
    localStorage.setItem("token", response.data.token);
    console.log(response, response.data.token);
    setLoading(false);
    if (response.data.token) navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 py-12 md:py-24 lg:py-32">
        <div className="container px-4 flex-1 flex items-center justify-center space-y-6">
          <div className="grid gap-3 sm:max-w-md sm:mx-auto sm:gap-4">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email below to login to your account
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                  defaultValue="p@g.com"
                  ref={emailRef}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  required
                  type="password"
                  ref={passwordRef}
                  defaultValue="pass"
                />
              </div>
              <Button className="w-full" disabled={loading} type="submit">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
