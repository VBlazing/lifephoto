import { NextResponse } from "next/server"

const portrait_parse_prompt = `
  【请提取图中人物的特征，以列表的形式返回信息】
  列表需包含人物主体、关键特征、人物细节
  注意：
  1. 返回的内容不可包含人物以外的信息
  2. 如果图中没有人物，返回 null
`

const landscape_parse_prompt = `
  【请提取图中人物的参数信息，以列表形式返回信息】
  列表需包含：人物在图中的位置、人物的大小、人物的姿势
  注意：如果图中没有人物，返回 null
`


/**
 * @description 根据图片解析人物信息
 * @param img image url
 * @returns image prompt
 */
async function parseImg(img: string, prompt: string) {
  const parseRes = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.BAILIAN_APIKEY}`,
    },
    body: JSON.stringify({
      model: 'qwen3-vl-plus',
      messages: [{
        role: "system",
        content: prompt
      }, {
        role: 'user',
        content: [
          { type: "image_url", image_url: { url: img } },
        ]
      }],
    })
  })

  if (!parseRes.ok) {
    return null
  }
  try {
    const data = await parseRes.json()
    return data.choices[0].message.content
  } catch {
    return null
  }
}

/**
 * @description 根据提示提取图
 * @param img image url
 * @param prompt prompt
 * @returns portrait image url
 */
async function imgExtract(img: string, prompt: string) {
  const extractionRes = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.BAILIAN_APIKEY}`,
    },
    body: JSON.stringify({
      model: "qwen-image-edit-plus",
      input: {
        messages: [
          {
            role: 'user',
            content: [
              { image: img },
              { text: prompt }
            ]
          }
        ]
      },
      parameters: {
        negative_prompt: '低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良、模糊、ps痕迹'
      }
    })
  })

  if (!extractionRes.ok) {
    console.log('提取人像失败', extractionRes.statusText)
    return null
  }
  try {
    const data = await extractionRes.json()
    if (data.code) {
      console.log('提取人像失败', data)
      return null
    }
    const image = data.output.choices[0].message.content[0].image
    return image
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const req = await request.json()
  const { portrait_img_url, landscape_img_url } = req

  const [portrait_info, position_info] = await Promise.all([
    // 人像照的人像信息
    parseImg(portrait_img_url, portrait_parse_prompt),
    // 风景照的人像位置信息
    parseImg(landscape_img_url, landscape_parse_prompt)
  ])
  console.log('【portrait_info】: ', portrait_info)
  console.log('【position_info】: ', position_info)

  if (['null', null].includes(portrait_info)) {
    return NextResponse.json({ code: 4001, error: 'No people were detected in the portrait image, please re-upload' })
  }
  const portrait_extract_prompt = "【提取图中的人像以白色背景展示】，人物描述如下\n" + portrait_info + "\n 注意：人物描述仅供提示，以图片实际人物为准"
  // 提取的人物图
  const portrait_extraction_img = await imgExtract(portrait_img_url, portrait_extract_prompt)

  if (!portrait_extraction_img) {
    return NextResponse.json({ code: 4001, error: 'No people were detected in the portrait image, please re-upload' })
  }

  // 风景图
  let landscape_extraction_img = landscape_img_url
  let position_prompt = null
  if (!['null', null].includes(position_info)) {
    // 剔除风景图的人像
    const landscape_extraction_prompt = "剔除图中的人像"
    landscape_extraction_img = await imgExtract(landscape_img_url, landscape_extraction_prompt)
    // 增加风景图中人物位置提示
    position_prompt = "，人物要求如下：\n" + position_info
  }

  if (!landscape_extraction_img) {
    return NextResponse.json({ code: 4000, error: 'Generation failed, please try again later.' })
  }

  const prompt = position_prompt ? '图1的人物出现在图2中' + position_prompt : '图1的人物出现在图2中'
  const modelRes = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.BAILIAN_APIKEY}`,
    },
    body: JSON.stringify({
      model: "qwen-image-edit-plus",
      input: {
        messages: [
          {
            role: 'user',
            content: [
              { image: portrait_extraction_img },
              { image: landscape_extraction_img },
              { text: prompt }
            ]
          }
        ]
      },
      parameters: {
        negative_prompt: '低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良、模糊、ps痕迹'
      }
    })
  })
  if (!modelRes.ok) {
    return NextResponse.json({ code: 4000, error: 'Generation failed, please try again later.' })
  }
  try {
    const data = await modelRes.json()
    if (data.code) {
      return NextResponse.json({ code: 4000, error: 'Generation failed, please try again later.' })
    }
    const image = data.output.choices[0].message.content[0].image
    return NextResponse.json({ code: 200, data: { image } })
  } catch {
    return NextResponse.json({ code: 4000, error: 'Generation failed, please try again later.' })
  }
}