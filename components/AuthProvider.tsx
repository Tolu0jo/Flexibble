"use client"; // because it wont be rendered on the server and we want to use useState
import { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
  signinUrlParams?: Record<string, string> | null;
};

type Providers = Record<string, Provider>;

export const AuthProviders = () => {
  const [providers, setProviders] = useState<Providers | null>(null);
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      console.log(res);
      setProviders(res);
    };
    fetchProviders();
  }, []);
  
  if (providers === null) {
    // Return a loading state or null while the providers are being fetched
    return null;
  }

  return (
    <div>
      {Object.values(providers).map((provider: Provider, i) => (
        <button key={i} onClick={() => signIn(provider?.id)}>
          {provider.id}
        </button>
      ))}
    </div>
  );
};

export default AuthProviders;
