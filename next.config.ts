/*
 * @Author: VBlazing
 * @Date: 2025-09-02 17:52:05
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-16 23:00:35
 * @Description: next config
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      // cos bucket
      hostname: 'lifephoto-1253367486.cos.ap-guangzhou.myqcloud.com'
    }, {
      // ali qianwen
      hostname: 'dashscope-result-sh.oss-cn-shanghai.aliyuncs.com'
    }]
  }
};

export default nextConfig;
