import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const target = 'https://music.163.com/weapi/login/qr/key';
    return proxyRequest(request, target);
}

async function proxyRequest(req: NextRequest, targetUrl: string) {
    try {
        const headers: any = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://music.163.com',
        };

        const cookie = req.headers.get('cookie');
        if (cookie) headers['Cookie'] = cookie;

        const response = await fetch(targetUrl, { 
            method: req.method, 
            headers 
        });

        const data = await response.json();
        const res = NextResponse.json(data);

        const setCookie = response.headers.get('set-cookie');
        if (setCookie) res.headers.set('Set-Cookie', setCookie);

        return res;
    } catch (e) {
        return NextResponse.json({ code: 500, msg: '代理失败' }, { status: 500 });
    }
}
