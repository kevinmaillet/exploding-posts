import {
  headerDefaults,
  setResponseInit,
  setResponseBody,
  setErrResponse,
} from './utils';
import { parse, serialize } from 'cookie';
const COOKIE_NAME = 'token';
//Below is route to my Cloudflare tunnel to Rust app
//Generate by running "cloudflared tunnel --url http://localhost:8080" in "Systems" subdirectory
const AUTH_URL =
  'https://intellectual-saved-everyone-express.trycloudflare.com';

const createCookie = (authCookie) => {
  authCookie = authCookie.split(' ')[0];

  const newCookieValue = authCookie.substring(
    authCookie.indexOf('=') + 1,
    authCookie.lastIndexOf(';')
  );

  return serialize(COOKIE_NAME, newCookieValue, {
    sameSite: 'none',
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  });
};

export async function handleRequest(request) {
  const cookie = parse(request.headers.get('Cookie') || '');
  const url = new URL(request.url);
  const path = url.pathname;

  console.log(request.cf);

  console.log(url.port);
  console.log(url.host);

  //GET posts
  if (request.method === 'GET' && path === '/posts') {
    let posts = [];

    const { keys } = await POSTS.list();

    for (const key of keys) {
      posts.push(await POSTS.get(key.name, { type: 'json' }));
    }

    const responseSettings = setResponseInit(200, 'OK');

    const responseBody = setResponseBody('OK', posts);

    const response = new Response(
      JSON.stringify(responseBody),
      responseSettings
    );

    return response;
  }

  //POST posts
  if (request.method === 'POST' && path === '/posts') {
    const { title, username, content } = JSON.parse(await request.text());

    //Create composite key to store post
    const createKey = (username, title) => {
      let key = `${username}_${title}`;
      key = key.replace(/\s+/g, '-').toLowerCase();
      return key;
    };

    let key = createKey(username, title);

    //Check for Missing Data
    if (!title || !username || !content) {
      const responseSettings = setResponseInit(400, 'Bad Request');

      const responseBody = setErrResponse('Bad Request', 'Missing Data Fields');

      const response = new Response(
        JSON.stringify(responseBody),
        responseSettings
      );

      return response;
    }

    //Check for posts w/ same title and user

    if (await POSTS.get(key)) {
      const responseSettings = setResponseInit(409, 'Conflict');

      const responseBody = setErrResponse(
        'Conflict',
        'Post with that title and username already exists'
      );

      const response = new Response(
        JSON.stringify(responseBody),
        responseSettings
      );

      return response;
    }

    //Check if username is taken and then check for jsonwebtoken

    if (await USERS.get(username.toLowerCase())) {
      //Check for cookie and then forward to auth app.
      if (cookie[COOKIE_NAME] != null) {
        const res = await fetch(`${AUTH_URL}/verify`, {
          headers: request.headers,
          method: 'GET',
        });
        const data = await res.text();

        //Token Expired
        if (data === 'ExpiredSignature') {
          const responseSettings = setResponseInit(401, 'Unauthorized');

          const responseBody = setErrResponse(
            'Unauthorized',
            'Session expired. Use a new username.'
          );

          const response = new Response(
            JSON.stringify(responseBody),
            responseSettings
          );

          return response;
        }

        //User ok to post
        if (data === username) {
          await POSTS.put(key, JSON.stringify({ title, username, content }));

          const responseSettings = setResponseInit(
            201,
            'Created',
            headerDefaults
          );

          const responseBody = setResponseBody('Created Post', {
            title,
            username,
            content,
          });

          const response = new Response(
            JSON.stringify(responseBody),
            responseSettings
          );

          return response;
        }
      }
      const responseSettings = setResponseInit(409, 'Conflict');

      const responseBody = setErrResponse('Conflict', 'User already taken.');

      const response = new Response(
        JSON.stringify(responseBody),
        responseSettings
      );

      return response;
    }
    // Add post, and user,  and issue jsonwebtoken from auth app.

    await POSTS.put(key, JSON.stringify({ title, username, content }));

    await USERS.put(username.toLowerCase(), 'Valid User');

    const res = await fetch(`${AUTH_URL}/auth/${username}`);

    //Create new cookie from auth response
    let authCookie = res.headers.get('set-cookie');

    let newCookie = createCookie(authCookie);

    const responseSettings = setResponseInit(201, 'Created', {
      'Set-Cookie': newCookie,
      ...headerDefaults,
    });

    const responseBody = setResponseBody('Created Post', {
      title,
      username,
      content,
    });

    const response = new Response(
      JSON.stringify(responseBody),
      responseSettings
    );

    return response;
  }

  const responseSettings = setResponseInit(404, 'Not Found');

  const responseBody = setErrResponse(
    'Bad Request',
    'Resource could not be found'
  );

  const response = new Response(JSON.stringify(responseBody), responseSettings);

  return response;
}
