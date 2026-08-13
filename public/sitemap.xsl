<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>AuraSpear SOC — XML Sitemap</title>
        <style>
          body{margin:0;background:#0c1422;color:#eaf1ff;font:15px system-ui,sans-serif}main{max-width:1180px;margin:auto;padding:40px 20px}h1{font-size:32px;margin:0 0 8px}p{color:#9fb5d6;margin:0 0 28px}table{width:100%;border-collapse:collapse;background:#111d30;border:1px solid #2a3b58;border-radius:12px;overflow:hidden}th,td{padding:12px 14px;border-bottom:1px solid #263752;text-align:left;vertical-align:top}th{background:#17243a;color:#76a7ff}a{color:#8bb5ff;overflow-wrap:anywhere}.pill{display:inline-block;margin:2px;padding:2px 7px;border:1px solid #36517a;border-radius:999px;font-size:12px}@media(max-width:700px){main{padding:20px 12px}th:nth-child(n+3),td:nth-child(n+3){display:none}}
        </style>
      </head>
      <body><main>
        <h1>AuraSpear SOC sitemap</h1>
        <p><xsl:value-of select="count(s:urlset/s:url)" /> public, localized URLs available to search engines.</p>
        <table><thead><tr><th>URL</th><th>Languages</th><th>Last modified</th><th>Priority</th></tr></thead><tbody>
          <xsl:for-each select="s:urlset/s:url">
            <tr>
              <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
              <td><xsl:for-each select="xhtml:link"><span class="pill"><xsl:value-of select="@hreflang" /></span></xsl:for-each></td>
              <td><xsl:value-of select="s:lastmod" /></td>
              <td><xsl:value-of select="s:priority" /></td>
            </tr>
          </xsl:for-each>
        </tbody></table>
      </main></body>
    </html>
  </xsl:template>
</xsl:stylesheet>
