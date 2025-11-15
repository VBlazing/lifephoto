/*
 * @Author: VBlazing
 * @Date: 2025-11-15 23:54:58
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-16 00:02:01
 * @Description: 类型定义
 */
export type STSCredential = {
  credentials: {
    sessionToken: string
    tmpSecretId: string
    tmpSecretKey: string
  }
  expiration: string
  expiredTime: number
  requestId: string
  startTime: number
}

export interface IGetSTSCredentialRes {
  code: number
  data: STSCredential
}