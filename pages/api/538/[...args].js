import { createProxyMiddleware } from 'http-proxy-middleware';
import nc from 'next-connect';

export const config = {
  api: {
    bodyParser: false,
  },
};

const onError = (err, req, res) => {
  console.log(err);

  res.status(500).end(err.toString());
};

const handler = nc({ onError })
  .use(createProxyMiddleware({
    target: 'https://projects.fivethirtyeight.com', // the data server
    changeOrigin: true,
    pathRewrite: {
      '^/api/538': '',
    },
  }));

export default handler;
