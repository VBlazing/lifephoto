/*
 * @Author: VBlazing
 * @Date: 2025-11-13 23:21:44
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-16 23:50:33
 * @Description: image upload component
 */
"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import cos from "@/lib/cos";
import { getUAKey, locationToUrl } from "@/lib/utils";

export default function ImageUpload({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string | null;
  onChange: (img: string | null) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleUploadFile = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }
    const file = files[0];
    if (file.size > 1024 * 1024 * 5) {
      toast.error("Please keep the file size less than 5MB.");
      return;
    }
    const fileType = file.type.includes("image/")
      ? file.type.split("image/")[1]
      : "png";

    setLoading(true);
    const uaKey = getUAKey();
    const dateStamp = new Date().getTime();
    const data = await cos.uploadFile({
      Bucket: "lifephoto-1253367486",
      Region: "ap-guangzhou",
      Key: `${uaKey}/${name}_${dateStamp}.${fileType}`,
      Body: file,
    });
    setLoading(false);
    if (data && data.statusCode === 200) {
      onChange(locationToUrl(data.Location));
    } else {
      toast.error(
        "Sorry, there was an error uploading the file. Please try again later.",
      );
    }
  };

  const render = () => {
    if (loading) {
      return (
        <div className="flex h-full w-full items-center justify-center p-6">
          <Skeleton className="h-full w-full" />
        </div>
      );
    }
    return (
      <>
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
              id={name}
              name={name}
              accept="image/png, image/jpg, image/jpeg"
            />
          </Label>
        )}
      </>
    );
  };

  return (
    <div className="border-border flex h-56 w-56 items-center justify-center rounded-xl border-2 border-dashed">
      {render()}
    </div>
  );
}
