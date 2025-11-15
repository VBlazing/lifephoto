/*
 * @Author: VBlazing
 * @Date: 2025-11-14 15:10:16
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-16 00:00:29
 * @Description: 获取腾讯 cos 上传的临时密钥
 */
import STS from 'qcloud-cos-sts'
import { NextResponse } from 'next/server';

export async function GET() {
  // 配置参数
  const config = {
    secretId: process.env.COS_SECRETID, // 固定密钥
    secretKey: process.env.COS_SECRETKEY, // 固定密钥
    proxy: '',
    durationSeconds: 3600,
    // host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
    // endpoint: 'sts.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com

    bucket: 'lifephoto-1253367486',
    region: 'ap-guangzhou',
    allowPrefix: '*', // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
    // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
    allowActions: [
      // 简单上传
      'name/cos:PutObject',
      'name/cos:PostObject',
      // 分片上传
      'name/cos:InitiateMultipartUpload',
      'name/cos:ListMultipartUploads',
      'name/cos:ListParts',
      'name/cos:UploadPart',
      'name/cos:CompleteMultipartUpload'
    ],
  };
  const shortBucketName = config.bucket.split('-')[0]
  const appId = config.bucket.split('-')[1]
  const policy = {
    'version': '2.0',
    'statement': [{
      'action': config.allowActions,
      'effect': 'allow',
      'principal': { 'qcs': ['*'] },
      'resource': [
        'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + config.allowPrefix,
      ],
    }],
  };
  try {
    const data: STS.CredentialData = await new Promise((res, rej) => {
      STS.getCredential({
        secretId: config.secretId as string,
        secretKey: config.secretKey as string,
        proxy: config.proxy,
        durationSeconds: config.durationSeconds,
        // endpoint: config.endpoint,
        policy: policy,
      }, function (err, tempKeys) {
        if (err) {
          rej(err)
        } else {
          res(tempKeys)
        }
      });
    })
    return NextResponse.json({ code: 200, data })
  } catch (e) {
    return NextResponse.json({ code: 500, error: e })
  }
}