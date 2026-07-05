module.exports = async (req, res) => {
    const { path } = req.query;

    let targetUrl = 'https://music.163.com/weapi';

    if (path === 'login/qr/key') targetUrl += '/login/qr/key';
    else if (path === 'login/qr/check') targetUrl += '/login/qr/check';
    else if (path === 'user/account') targetUrl += '/nuser/account/get';
    else if (path === 'song/url') targetUrl += '/song/enhance/player/url';
    else if (path === 'lyric') targetUrl += '/song/lyric';

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://music.163.com',
                'Cookie': req.headers.cookie || ''
            }
        });

        const data = await response.json();
        res.setHeader('Set-Cookie', response.headers.raw()['set-cookie'] || []);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ code: 500, msg: '代理失败' });
    }
};
