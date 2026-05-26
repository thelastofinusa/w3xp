/* eslint-disable react/jsx-no-target-blank */
import { Container } from "./container"

export function Footer() {
  return (
    <Container>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Powered by{" "}
        <a
          href="https://w3docs.vercel.app"
          target="_blank"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          w3docs
        </a>
        , your source for modern Web3 documentation.
      </footer>
    </Container>
  )
}
