import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';

    let targetUrl = 'https://music.163.com/weapi';

    if (path === 'login/qr/key') targetUrl += '/login/qr/key';
    else if (path === 'login/qr/check') targetUrl += '/login/qr/check';
    else if (path === 'user/account') targetUrl += '/nuser/account/get';
    else if (path === 'song/url') targetUrl += '/song/enhance/player/url';
    else if (path === 'lyric') targetUrl += '/song/lyric';
    else return NextResponse.json({ code: 404, msg: '未知接口' }, { status: 404 });

    try {
        const headers: any = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://music.163.com',
        };

        const cookie = request.headers.get('cookie');
        if (cookie) headers['Cookie'] = cookie;

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers,
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
