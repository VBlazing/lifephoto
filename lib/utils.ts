import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @description 拼接url
 * @param location { string } location
 * @returns {string} url
 */
export const locationToUrl = (location: string) => 'https://' + location


/**
 * @description 根据UA返回唯一key
 * @returns { string } uaKey
 */
export const getUAKey = () => {
  const userAgent = navigator.userAgent;
  const uniqueId = btoa(userAgent); // 将userAgent编码为Base64
  return uniqueId.slice(0, 10)
}