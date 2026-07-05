import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        code: 200,
        msg: "网易云音乐代理服务运行正常",
        version: "2026.07 - 极简版"
    });
}
