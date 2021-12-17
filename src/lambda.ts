import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createPageRenderer } from "vite-plugin-ssr";


const renderPage = createPageRenderer({
  isProduction: true,
  root: process.env.IS_LOCAL
    ? `${__dirname}/../../../../vue`
    : `${__dirname}/..`,
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  let url = event.rawPath;

  if (event.rawQueryString) {
    url += "?" + event.rawQueryString;
  }

  const pageContextInit = { url };
  console.log('rendering...');
  const pageContext = await renderPage(pageContextInit);
  console.log('pageContext =', pageContext);
  const { httpResponse } = pageContext;
  if (!httpResponse) return { statusCode: 200, body: "??" };
  const { body, statusCode, contentType } = httpResponse;

  return {
    statusCode,
    headers: { "Content-Type": contentType },
    body,
  };
};
