export const headerDefaults =
{
    "Content-type": "application-json",
    "Access-Control-Allow-Origin": "https://posts-web.pages.dev",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
}

export const setResponseInit = (status, statusText, headers = headerDefaults) => {
    return {
        status,
        statusText,
        headers
    }
}

export const setResponseBody = (status, data) => {
    return {
        status,
        data
    }
}

export const setErrResponse = (status, errors) => {
    return {
        status,
        errors
    }
}

