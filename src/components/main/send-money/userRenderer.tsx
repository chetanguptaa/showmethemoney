"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, MessageSquareText } from "lucide-react";
import UserProfile from "./userProfile";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

type Props = {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
};

const UserRenderer = ({ email, avatar, name, id }: Props) => {
  const { control, handleSubmit } = useForm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      data.id = id;
      const response = await axios.post("/api/users/send", data);
      toast({
        variant: "default",
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failure",
        description: error.response.statusText,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col sm:flex sm:flex-row  items-center">
      <div className="flex justify-start">
        <UserProfile avatar={avatar} name={name} email={email} />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="ml-auto font-medium mt-6 sm:mt-0"
            variant="default"
          >
            Send
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit((data) => onFormSubmit(data))}>
            <DialogHeader>
              <DialogTitle>Enter your amount</DialogTitle>
              <DialogDescription>and click on send</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="amount" className="text-right text-lg">
                  <DollarSign />
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="amount"
                      className="col-span-3"
                      type="number"
                      min={1}
                      max={10000}
                      required
                    />
                  )}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="message" className="text-right text-lg">
                  <MessageSquareText />
                </Label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="message"
                      className="col-span-3"
                      type="text"
                      minLength={1}
                      maxLength={100}
                      required
                    />
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRenderer;