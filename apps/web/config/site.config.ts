export const siteConfig = {
  name: "w3docs",
  slogan: "Interactive documentation for deployed smart contracts.",
  username: "thelastofinusa",
  nickname: "Holiday",
  description:
    "A CLI tool that generates interactive smart contract documentation websites directly from deployed contracts.",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://w3docs.vercel.app",
}
