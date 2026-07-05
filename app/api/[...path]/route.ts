import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleRequest(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleRequest(request, params.path);
}

async function handleRequest(req: NextRequest, pathSegments: string[]) {
    const path = pathSegments.join('/');
    let targetUrl = `https://music.163.com/weapi`;

    if (path.includes('login/qr/key')) targetUrl += '/login/qr/key';
    else if (path.includes('login/qr/check')) targetUrl += '/login/qr/check';
    else if (path.includes('user/account')) targetUrl += '/nuser/account/get';
    else if (path.includes('song/url')) targetUrl += '/song/enhance/player/url';
    else if (path.includes('lyric')) targetUrl += '/song/lyric';
    else if (path.includes('playlist')) targetUrl += '/v6/playlist/detail';
    else if (path.includes('captcha')) targetUrl += '/sms/captcha/sent';
    else if (path.includes('login/cellphone')) targetUrl += '/login/cellphone';
    else targetUrl += '/' + path;

    const url = new URL(req.url);
    const search = url.searchParams.toString();
    if (search) targetUrl += '?' + search;

    try {
        const headers: any = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://music.163.com',
        };

        const cookie = req.headers.get('cookie');
        if (cookie) headers['Cookie'] = cookie;

        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method === 'POST' ? await req.text() : null,
        });

        const data = await response.json();
        const res = NextResponse.json(data);

        const setCookie = response.headers.get('set-cookie');
        if (setCookie) res.headers.set('Set-Cookie', setCookie);

        return res;
    } catch (e) {
        return NextResponse.json({ code: 500, msg: '代理错误' }, { status: 500 });
    }
}
