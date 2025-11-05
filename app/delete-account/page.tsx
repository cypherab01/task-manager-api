"use client";

import { deleteAccount } from "@/actions/deleteAccount";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

type DeleteAccountState =
  | {
      error?: string | null;
      message?: string | null;
    }
  | undefined;

const page = () => {
  const [state, action, isPending] = useActionState<
    DeleteAccountState,
    FormData
  >(deleteAccount, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <div className="container mx-auto max-w-md w-dvh h-dvh flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Delete Account</h1>

      <form action={action} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />

          {state?.error && (
            <p className="text-red-500 text-sm mt-1">{state.error}</p>
          )}
          {state?.message && (
            <p className="text-green-500 text-sm mt-1">{state.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-red-500 hover:bg-red-600 text-white rounded-md p-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Deleting..." : "Delete Account"}
        </button>
      </form>
    </div>
  );
};

export default page;
