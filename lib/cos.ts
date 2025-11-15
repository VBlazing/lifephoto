import COS from 'cos-js-sdk-v5'

export async function getSTSTmpSecretKey() {
  const res = await fetch('/api/STS').then(res => res.json())
  if (res.code !== 200) {
    return null
  }
  return res.data
}

const cos = new COS({
  getAuthorization: async function (options, callback) {
    const data = await getSTSTmpSecretKey();
    if (!data) {
      return
    }
    callback({
      TmpSecretId: data.credentials.tmpSecretId,
      TmpSecretKey: data.credentials.tmpSecretKey,
      SecurityToken: data.credentials.sessionToken,
      StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
      ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
    });
  }
})

export default cos