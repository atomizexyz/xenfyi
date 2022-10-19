import { Html, Head, Main, NextScript } from "next/document";
import { clsx } from "clsx";

export default function Document() {
  return (
    <Html>
      <Head />
      <body
        className={clsx("bg-base-100", {
          "bg-[url(/images/bg.svg)] bg-[no-repeat] bg-[center] bg-[fixed]":
            true,
        })}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
