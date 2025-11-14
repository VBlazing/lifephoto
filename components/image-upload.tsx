/*
 * @Author: VBlazing
 * @Date: 2025-11-13 23:21:44
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-14 13:48:58
 * @Description: image upload component
 */
"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (img: string | null) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const handleUploadFile = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }
    const file = files[0];
    // if (file.size > 1024 * 1024 *)
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    const data = await fetch("/api/upload", {
      method: "post",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    });
    console.log("data: ", data);
    setLoading(false);
    // if
    const img = URL.createObjectURL(file);
    onChange(img);
  };
  return (
    <div className="border-border flex h-56 w-56 items-center justify-center rounded-xl border-2 border-dashed">
      {value ? (
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="relative h-full">
            <X
              onClick={() => {
                onChange(null);
              }}
              className="absolute top-0 right-0 size-5 translate-x-[50%] -translate-y-[50%] cursor-pointer rounded-full border border-gray-600 bg-white p-0.5 text-gray-600 opacity-80"
            />
            <Image
              alt={`${label} preview`}
              width={172}
              height={172}
              src={value}
              className="h-full object-contain"
            />
          </div>
        </div>
      ) : (
        <Label className="border-border relative h-10 cursor-pointer rounded-lg border bg-gray-600 p-4 text-amber-50">
          {label}
          <Input
            onChange={(e) => {
              handleUploadFile(e.target.files);
            }}
            type="file"
            className="absolute top-0 left-0 z-[-1] h-full w-full rounded-lg opacity-0"
            id="portrait"
            name="portrait"
            accept="image/png, image/jpg, image/jpeg"
          />
        </Label>
      )}
    </div>
  );
}
