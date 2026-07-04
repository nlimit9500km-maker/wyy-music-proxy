const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MUSIC_API = 'https://music.163.com/api';

// 通用请求函数
async function request(method, path, params = {}, cookie = '') {
    const url = `https://music.163.com${path}`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://music.163.com',
        'Cookie': cookie,
    };
    const config = {
        method,
        url,
        headers,
        params: method === 'get' ? params : undefined,
        data: method === 'post' ? params : undefined,
    };
    const response = await axios(config);
    return response.data;
}

// 所有路由
app.get('/login/qr/key', async (req, res) => {
    try {
        const data = await request('get', '/login/qr/key', { t: Date.now() });
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/login/qr/create', async (req, res) => {
    try {
        const { key, qrimg } = req.query;
        if (qrimg === 'true') {
            const response = await axios.get(`https://music.163.com/login/qr/create?key=${key}&qrimg=true&t=${Date.now()}`, {
                responseType: 'stream',
                headers: { 'User-Agent': 'Mozilla/5.0' },
            });
            res.setHeader('Content-Type', 'image/png');
            response.data.pipe(res);
        } else {
            const data = await request('get', '/login/qr/create', { key, t: Date.now() });
            res.json(data);
        }
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/login/qr/check', async (req, res) => {
    try {
        const { key } = req.query;
        const data = await request('get', '/login/qr/check', { key, t: Date.now() });
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/login/cellphone', async (req, res) => {
    try {
        const { phone, password, captcha } = req.query;
        let path = `/login/cellphone?phone=${phone}`;
        if (captcha) {
            path += `&captcha=${captcha}`;
        } else {
            path += `&password=${encodeURIComponent(password)}`;
        }
        const data = await request('get', path);
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/captcha/sent', async (req, res) => {
    try {
        const { phone } = req.query;
        const data = await request('get', `/captcha/sent?phone=${phone}`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/user/account', async (req, res) => {
    try {
        const { cookie } = req.query;
        const data = await request('get', '/user/account', {}, cookie);
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/user/playlist', async (req, res) => {
    try {
        const { uid, cookie } = req.query;
        const data = await request('get', `/user/playlist?uid=${uid}`, {}, cookie);
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/playlist/track/all', async (req, res) => {
    try {
        const { id, cookie } = req.query;
        const data = await request('get', `/playlist/track/all?id=${id}`, {}, cookie);
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/song/url', async (req, res) => {
    try {
        const { id, cookie } = req.query;
        const data = await request('get', `/song/url?id=${id}`, {}, cookie);
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/lyric', async (req, res) => {
    try {
        const { id, cookie } = req.query;
        const data = await request('get', `/lyric?id=${id}`, {}, cookie);
        res.json(data);
    } catch (e) {
        res.status(500).json({ code: 500, msg: e.message });
    }
});

app.get('/check', (req, res) => {
    res.json({ code: 200, msg: 'ok' });
});

// 处理根路径
app.get('/', (req, res) => {
    res.json({ code: 200, msg: '网易云代理服务运行正常' });
});

module.exports = app;