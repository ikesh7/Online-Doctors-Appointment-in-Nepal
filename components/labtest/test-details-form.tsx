"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Services } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";

interface TestDetailsSectionProps {
  form: UseFormReturn<any>;
}

export const TestDetailsSection = ({ form }: TestDetailsSectionProps) => {
  const testTypes = [
    "blood test",
    "x-ray",
    "MRI",
    "CT scan",
    "ultrasound",
    "ECG",
    "other",
  ];
  return (
    <>
      {/* Test Type Selection with Checkboxes */}
      <FormField
        control={form.control}
        name="testTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test Type</FormLabel>
            <div className="space-y-2">
              {testTypes.map((testType) => (
                <div key={testType} className="flex items-center">
                  <Checkbox
                    checked={field.value?.includes(testType)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...field.value, testType]);
                      } else {
                        field.onChange(
                          field.value.filter(
                            (item: string) => item !== testType
                          )
                        );
                      }
                    }}
                  />
                  <span className="ml-2">{testType}</span>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Priority Selection */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Request Date */}
        <FormField
          control={form.control}
          name="requestDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Special Instructions */}
      <FormField
        control={form.control}
        name="specialInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Instructions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any special instructions or notes"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
