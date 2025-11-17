/*
 * @Author: VBlazing
 * @Date: 2025-11-13 16:34:42
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-17 19:48:31
 * @Description: generate life photo page
 */
"use client";

import { useState } from "react";
import { ArrowBigRightDash, Plus } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

export default function Beauty() {
  const [portraitImg, setPortraitImg] = useState<string | null>(null);
  const [landscapeImg, setLandscapeImg] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const generatePreview = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "post",
      body: JSON.stringify({
        portrait_img_url: portraitImg,
        landscape_img_url: landscapeImg,
      }),
    }).then((res) => res.json());
    setLoading(false);
    if (res.code !== 200) {
      toast.error(res.error);
      return;
    }
    setPreviewImg(res.data.image);
  };

  return (
    <div className="h-screen min-h-screen w-full">
      <div className="mt-10 flex w-full items-center justify-center space-x-10">
        {/* upload picture */}
        <div className="flex flex-col items-center space-y-6">
          {/* portrait */}
          <ImageUpload
            value={portraitImg}
            onChange={(img) => setPortraitImg(img)}
            label="Upload portrait"
            name="portrait"
          />
          <Plus className="size-12 text-gray-600" />
          {/* landscape */}
          <ImageUpload
            value={landscapeImg}
            onChange={(img) => setLandscapeImg(img)}
            label="Upload landscape"
            name="landscape"
          />
        </div>
        {/* Render button */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={generatePreview}
            // disabled={!(landscapeImg && portraitImg)}
            className="peer cursor-pointer bg-gray-600"
          >
            Render
          </Button>
          <ArrowBigRightDash className="size-8 text-gray-600 transition-transform duration-200 peer-hover:translate-x-2" />
        </div>
        {/* preview */}
        <div className="w-full max-w-2xl">
          {loading && "加载中"}
          {/* no image */}
          {!previewImg ? (
            <div className="h-[400px] rounded-2xl bg-gray-600" />
          ) : (
            <Image
              alt="generate preview image"
              width="600"
              height="600"
              className="h-full object-contain"
              src={previewImg}
            />
          )}
        </div>
      </div>
    </div>
  );
}
