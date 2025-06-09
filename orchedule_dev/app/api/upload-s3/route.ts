// app/api/upload-s3/route.ts

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const contentType = file.type;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
      ContentDisposition: "inline", // 브라우저 미리보기 가능하게
    });

    await s3Client.send(command);

    const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json({
      url,
      publicId: `s3-${fileName}`,
      pageCount: 1,
      type: file.type,
    });
  } catch (error) {
    console.error("S3 업로드 오류:", error);
    return NextResponse.json(
      { error: "S3 업로드 중 오류 발생" },
      { status: 500 }
    );
  }
}
