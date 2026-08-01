export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="bg-background min-h-screen">{children}</div>
}
