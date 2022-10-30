import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body
        className={
          "bg-base-100 bg-[url(/images/bg.svg)] bg-no-repeat bg-center bg-fixed"
        }
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
