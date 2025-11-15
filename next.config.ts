/*
 * @Author: VBlazing
 * @Date: 2025-09-02 17:52:05
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-16 00:24:11
 * @Description: next config
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      // cos bucket
      hostname: 'lifephoto-1253367486.cos.ap-guangzhou.myqcloud.com'
    }]
  }
};

export default nextConfig;
