"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const themePresets = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

export function AppearanceSettings() {
  const [theme, setTheme] = React.useState("system");

  const form = useForm({
    resolver: zodResolver(appearanceSchema),
    defaultValues: { theme: "system" },
  });

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    if (theme === "system") return;
    document.documentElement.classList.add(theme);
  }, [theme]);

  function onSubmit(data) {
    setTheme(data.theme);
    toast.success("Theme updated!", {
      description: `Theme set to ${data.theme}.`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTheme(value); // Live update
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {themePresets.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Theme</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
