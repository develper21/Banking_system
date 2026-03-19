"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import Image from "next/image";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const getLinkToken = async () => {
      if (!user) {
        console.log("No user provided");
        return;
      }
      
      try {
        setIsLoading(true);
        setError("");
        console.log("Starting link token creation...");
        const data = await createLinkToken(user);
        console.log("Link token response:", data);
        
        if (data?.linkToken) {
          setToken(data.linkToken);
        } else {
          setError("Failed to get link token. Please try again.");
        }
      } catch (err: any) {
        console.error("Failed to create link token:", err);
        setError("Failed to connect to bank service. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getLinkToken();
  }, [user, retryCount]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      try {
        await exchangePublicToken({
          publicToken: public_token,
          user,
        });
        router.push("/");
        router.refresh();
      } catch (err: any) {
        console.error("Failed to exchange public token:", err);
        setError("Failed to connect bank. Please try again.");
      }
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = () => {
    if (!token) {
      setError("Token not ready. Retrying...");
      setRetryCount(prev => prev + 1);
      return;
    }
    
    if (error) {
      setError("");
    }
    
    // Open Plaid - if not ready, it will handle internally
    try {
      open();
    } catch (err) {
      console.log("Plaid not ready yet, will retry...");
      setRetryCount(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setError("");
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-red-600">{error}</p>
        <Button onClick={handleRetry} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  // Determine button text based on state
  let buttonText = "Connect bank";
  if (isLoading) buttonText = "Loading...";
  else if (!token) buttonText = "Initializing...";
  // else show "Connect bank" - token is ready!

  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className="plaidlink-primary"
        >
          {buttonText}
        </Button>
      ) : variant === "ghost" ? (
        <Button
          onClick={handleClick}
          variant="ghost"
          disabled={isLoading}
          className="plaidlink-ghost"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="hiddenl text-[16px] font-semibold text-black-2 xl:block">
            {buttonText}
          </p>
        </Button>
      ) : (
        <Button 
          onClick={handleClick} 
          disabled={isLoading}
          className="plaidlink-default"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="text-[16px] font-semibold text-black-2">
            {buttonText}
          </p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
