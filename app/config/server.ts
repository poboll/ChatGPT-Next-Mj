import md5 from "spark-md5";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string;
      CODE?: string;
      BASE_URL?: string;
      PROXY_URL?: string;
      VERCEL?: string;
      HIDE_USER_API_KEY?: string; // disable user's api key input
      DISABLE_GPT4?: string; // allow user to use gpt-4 or not
    }
  }
}

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
  const code = process.env.CODE;

  try {
    const codes = (code?.split(",") ?? [])
      .filter((v) => !!v)
      .map((v) => md5.hash(v.trim()));
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();

export const getServerSideConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  // 从这里开始
  //const apiKeys = (process.env.OPENAI_API_KEY ?? '').split(',')
  //const apiKey = apiKeys.at(Math.floor(Math.random() * apiKeys.length)) ?? ''
  const apiKeys = process.env.OPENAI_API_KEY || '';
  const apiKeysList = apiKeys.split(',').filter(key => key !== '');
  const apiKey = apiKeysList[Math.floor(Math.random() * apiKeysList.length)] || '';
  console.log(`Selected API key is ${apiKey}`);
  return {
    //原来的代码apiKey: process.env.OPENAI_API_KEY,
    apiKey,
    code: process.env.CODE,
    codes: ACCESS_CODES,
    needCode: ACCESS_CODES.size > 0,
    baseUrl: process.env.BASE_URL,
    proxyUrl: process.env.PROXY_URL,
    isVercel: !!process.env.VERCEL,
    hideUserApiKey: !!process.env.HIDE_USER_API_KEY,
    enableGPT4: !process.env.DISABLE_GPT4,
  };
};
