"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

// const SCHOOL_LIST = [
//   "University of Curaçao", // Corrected spelling
//   "University of the Dutch Caribbean", // Corrected spelling
//   "Kolegio Alejandro Paula", // Corrected spelling
//   "Radulphus College", // Corrected spelling
//   "University of Aruba",
//   "Erasmus University Rotterdam", // Netherlands
//   "University of Amsterdam", // Netherlands
//   "Leiden University", // Netherlands
//   "Harvard University", // USA
//   "Stanford University", // USA
//   "Massachusetts Institute of Technology (MIT)", // USA
//   "University of Oxford", // UK
//   "University of Cambridge", // UK
//   "Sorbonne University", // France
//   "University of Tokyo", // Japan
//   "National University of Singapore", // Singapore
//   "University of Melbourne", // Australia
//   "University of Toronto", // Canada
// ];

function Combobox({ value, setValue, options }) {
  const [search, setSearch] = useState("");
  const SCHOOL_LIST = options;
  const filtered = options?.filter((option) =>
    option?.toLowerCase()?.includes(search?.toLowerCase())
  );

  return (
    <div className="relative">
      <Input
        placeholder="Start typing your school name..."
        value={search || value}
        onChange={(e) => {
          setSearch(e.target.value);
          setValue(e.target.value);
        }}
        className="mb-2"
      />
      {search && !SCHOOL_LIST?.includes(search) && filtered.length > 0 && (
        <div className="border rounded-md shadow bg-white absolute z-10 w-full">
          {filtered.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setValue(option);
                setSearch(option);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AudienceStep({ profile, setProfile, onNext, schools }) {
  const [role, setRole] = useState(profile.role || "student");
  const [school, setSchool] = useState(profile.school || "");
  const SCHOOL_LIST = schools
    .filter((s) => s.isActive === false || role === "student")
    .map((s) => s.name);

  const handleNext = () => {
    setProfile({
      ...profile,
      role,
      school: role !== "other" ? school : "",
      schoolId: schools.find(
        (s) => s?.name?.toLowerCase() === school?.toLowerCase()
      ).id,
      name: role === "school" ? school : "",
    });
    onNext();
  };

  return (
    <motion.div
      key="audience"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold text-blue-500 text-center">
          How do you plan on using Readify?
        </h2>
        <RadioGroup
          value={role}
          onValueChange={setRole}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="student"
              id="student"
              className="border-2 border-gray-500"
            />
            <Label htmlFor="student">I am a Student</Label>
          </div>
          <p className="text-xs text-gray-600">
            As a student, you gain access to educational resources, stores, and
            the ability to make purchases within your affiliated school's
            ecosystem.
          </p>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="school"
              id="school"
              className="border-2 border-gray-500"
            />
            <Label htmlFor="school">I am representing a School</Label>
          </div>
          <p className="text-xs text-gray-600">
            Schools manage the primary transaction wallet, enabling rewards for
            student engagement, such as reading achievements. Additionally, you
            will receive administrative privileges to upload custom educational
            content, create assessments, and validate student progress.
          </p>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="other"
              className="border-2 border-gray-500"
              id="other"
            />
            <Label htmlFor="other">I am an Independent Reader</Label>
          </div>
          <p className="text-xs text-gray-600">
            Independent readers can fully enjoy Readify's learning and testing
            features, although access to the integrated store and token earning
            opportunities are exclusively available to affiliated students and
            organizations.
          </p>
        </RadioGroup>
        {role !== "other" && (
          <div className="w-full max-w-xs">
            {role === "student" && (
              <Label className="mb-3 block" htmlFor="combobox">
                Select your school
              </Label>
            )}
            {role === "school" && (
              <Label className="mb-3 block" htmlFor="combobox">
                Enter the school you are representing
              </Label>
            )}
            <Combobox
              value={school}
              setValue={setSchool}
              options={SCHOOL_LIST}
              className=""
            />
          </div>
        )}
        <Button
          onClick={handleNext}
          size="lg"
          className="px-8 py-4 text-lg shadow-lg"
          disabled={
            (role === "student" && !school) || (role === "school" && !school)
          }
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
