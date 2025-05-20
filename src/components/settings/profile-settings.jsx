"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  school: z.string().min(2, { message: "Select a school." }),
  bio: z
    .string()
    .max(160, { message: "Profile information is too long." })
    .optional(),
  profilePicture: z.any().optional(),
});
const schools = [
  "University of Curacao",
  "Radulphus College Curacao",
  "University Dutch Caribean",
];

export function ProfileSettings() {
  const [profilePic, setProfilePic] = React.useState(null);
  const [profilePicURL, setProfilePicURL] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      school: "",
      bio: "",
      profilePicture: null,
    },
  });

  function handleProfilePicChange(e) {
    const file = e.target.files[0];
    setProfilePic(file);
    setProfilePicURL(file ? URL.createObjectURL(file) : null);
    form.setValue("profilePicture", file);
  }

  function onSubmit(data) {
    toast.success("Profile saved!", {
      description: "Your profile changes have been saved.",
    });
  }

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profilePicture"
              render={() => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        {profilePicURL ? (
                          <AvatarImage src={profilePicURL} alt="Profile" />
                        ) : (
                          <AvatarFallback>U</AvatarFallback>
                        )}
                      </Avatar>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="w-auto"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a square image for best results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a school..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Information</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormDescription>Max 160 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
