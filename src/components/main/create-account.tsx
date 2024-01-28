"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { handleFormSubmit } from "@/app/actions/create-account";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";

const CreateAccount = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm();
  const { toast } = useToast();

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    const response = await handleFormSubmit(data);
    if (response.status === "success") {
      toast({
        variant: "default",
        title: "Success.",
        description: "Account created successfully!",
      });
      router.push("/");
    } else if (response) {
      const { error } = response;
      if (error instanceof ZodError) {
        toast({
          variant: "destructive",
          title: "Failure.",
          description: "Invalid Inputs!!!",
        });
        return;
      } else {
        toast({
          variant: "default",
          title: "Failure.",
          description: "Account already exist!!!",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center min-h-[80vh]">
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Create your account in just one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => onFormSubmit(data))}>
            <div className="grid w-full items-center gap-4">
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="amount"
                    placeholder="Enter initial amount💲"
                    min={100}
                    max={10000}
                    required
                    type="number"
                  />
                )}
              />
            </div>
            <div className="pt-8 pb-2">
              <Button type="submit" className="w-full" disabled={loading}>
                Create
              </Button>
            </div>
          </form>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAccount;
