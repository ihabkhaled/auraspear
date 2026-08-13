<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>AuraSpear SOC — RSS Feed</title>
        <style>
          body{margin:0;background:#0c1422;color:#eaf1ff;font:15px system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:40px 20px}h1{font-size:32px;margin:0 0 8px}p{color:#9fb5d6}.intro{margin-bottom:28px}.item{display:grid;grid-template-columns:1fr auto;gap:8px;margin:12px 0;padding:18px;background:#111d30;border:1px solid #2a3b58;border-radius:12px}.item h2{font-size:17px;margin:0}.item p{grid-column:1/-1;margin:0;line-height:1.6}.language{color:#76a7ff;font-weight:700}a{color:#eaf1ff;text-decoration:none}a:hover{color:#8bb5ff}@media(max-width:600px){main{padding:20px 12px}.item{grid-template-columns:1fr}}
        </style>
      </head>
      <body><main>
        <h1><xsl:value-of select="rss/channel/title" /> RSS feed</h1>
        <p class="intro"><xsl:value-of select="rss/channel/description" /> <xsl:value-of select="count(rss/channel/item)" /> entries.</p>
        <xsl:for-each select="rss/channel/item">
          <article class="item">
            <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
            <span class="language"><xsl:value-of select="dc:language" /></span>
            <p><xsl:value-of select="description" /></p>
          </article>
        </xsl:for-each>
      </main></body>
    </html>
  </xsl:template>
</xsl:stylesheet>
