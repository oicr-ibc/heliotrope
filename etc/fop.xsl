<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                exclude-result-prefixes="fo">
  <xsl:template match="html:html">
    <fo:root writing-mode="lr-tb" hyphenate="false" text-align="start" role="html:html">
      <fo:layout-master-set>
        <fo:simple-page-master page-width="auto" page-height="auto" master-name="all-pages">
          <fo:region-body column-gap="12pt" column-count="1" margin-left="1in" margin-bottom="1in" margin-right="1in" margin-top="1in"></fo:region-body>
          <fo:region-before display-align="before" extent="1in" region-name="page-header" />
          <fo:region-after display-align="after" extent="1in" region-name="page-footer" />
          <fo:region-start extent="1in" />
          <fo:region-end extent="1in" />
        </fo:simple-page-master>
      </fo:layout-master-set>
      <fo:page-sequence master-reference="all-pages">
        <fo:title><xsl:value-of select="html:head/html:title"/></fo:title>
        <fo:static-content flow-name="page-header">
          <fo:block font-size="small" font-weight="bold" text-align="center" space-before="0.5in" space-before.conditionality="retain"><xsl:value-of select="html:head/html:title"/></fo:block>
        </fo:static-content>
        <fo:static-content flow-name="page-footer">
          <fo:block font-size="small" text-align-last="justify" space-after="0.5in" space-after.conditionality="retain">

          Page <fo:page-number /> of <fo:page-number-citation ref-id="last-page"/>
          
          <xsl:text> </xsl:text>
            <fo:leader leader-length.minimum="12pt" leader-length.optimum="40pt" leader-length.maximum="100%" leader-pattern="space"/>
            <xsl:text> </xsl:text>
    
          <xsl:if test="html:head/html:meta[@name = 'date']">
            Generated on
            <xsl:value-of select="html:head/html:meta[@name = 'date']/@content"/>
          </xsl:if>

          </fo:block>
        </fo:static-content>
        <xsl:apply-templates select="html:body" />
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
  
  <xsl:template match="html:body">
    <fo:flow flow-name="xsl-region-body">
      <fo:block role="html:body" font-size="0.8em" >
        <xsl:apply-templates />
      </fo:block>
      <fo:block id="last-page"/>
    </fo:flow>
  </xsl:template>
  
  <xsl:template match="html:h2">
    <fo:block font-size="1.4em" font-weight="bold" space-before="0.83em" space-after="0.83em" keep-with-next.within-column="always" keep-together.within-column="always" role="html:h2">
      <xsl:apply-templates />
    </fo:block>
  </xsl:template>

  <xsl:template match="html:h3">
    <fo:block font-size="1.1em" font-weight="bold" space-before="0.83em" space-after="0.83em" keep-with-next.within-column="always" keep-together.within-column="always" role="html:h2">
      <xsl:apply-templates />
    </fo:block>
  </xsl:template>

  <xsl:template match="html:h4">
    <fo:block font-weight="bold" space-before="0.83em" space-after="0.83em" keep-with-next.within-column="always" keep-together.within-column="always" role="html:h2">
      <xsl:apply-templates />
    </fo:block>
  </xsl:template>

  <xsl:template match="html:p">
    <fo:block space-before="1em" space-after="1em" role="html:p">
      <xsl:apply-templates />
    </fo:block>
  </xsl:template>
  
  <xsl:template match="html:hr">
    <fo:block border-bottom="1px inset" space-before="0.67em" space-after="0.67em" role="html:hr"/>
  </xsl:template>
  
  <xsl:template match="html:em">
    <fo:inline font-style="italic" role="html:em">
      <xsl:apply-templates />
    </fo:inline>
  </xsl:template>
  
  <xsl:template match="html:b">
    <fo:inline font-weight="bold" role="html:b">
      <xsl:apply-templates />
    </fo:inline>
  </xsl:template>
  
  <xsl:template match="html:a[@href]">
    <fo:basic-link text-decoration="underline" color="blue" role="html:a">
          <xsl:attribute name="external-destination">
            <xsl:text>url('</xsl:text>
            <xsl:value-of select="@href"/>
            <xsl:text>')</xsl:text>
          </xsl:attribute>
          <xsl:apply-templates />
      </fo:basic-link>
  </xsl:template>
  
  <xsl:template match="html:table">
    <fo:table>
      <xsl:for-each select="descendant-or-self::html:tr[1]/html:th|descendant-or-self::html:tr[1]/html:td">
        <fo:table-column>
          <xsl:attribute name="column-width"><xsl:value-of select="@width div 72" />in</xsl:attribute>
        </fo:table-column>
      </xsl:for-each>
      <fo:table-body>
        <xsl:apply-templates />
      </fo:table-body>
    </fo:table>
  </xsl:template>

  <xsl:template match="html:tr">
    <fo:table-row>
      <xsl:apply-templates/>
    </fo:table-row>
  </xsl:template>

  <xsl:template match="html:th">
    <fo:table-cell font-weight="bold">
      <xsl:if test="ancestor::html:table[1]/@border > 0">
        <xsl:attribute name="border-style">solid</xsl:attribute>
        <xsl:attribute name="border-width">1pt</xsl:attribute>
      </xsl:if>
      <fo:block>
        <xsl:choose>
          <xsl:when test="@align='left'">
            <xsl:attribute name="text-align">left</xsl:attribute>
          </xsl:when>
          <xsl:when test="@align='right'">
            <xsl:attribute name="text-align">end</xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <xsl:attribute name="text-align">center</xsl:attribute>
          </xsl:otherwise>
      </xsl:choose>
        <xsl:apply-templates />
      </fo:block>
    </fo:table-cell>
  </xsl:template>
  
  <xsl:template match="html:td">
    <fo:table-cell>
      <xsl:if test="ancestor::html:table/@border > 0">
        <xsl:attribute name="border-style">solid</xsl:attribute>
        <xsl:attribute name="border-width">1pt</xsl:attribute>
      </xsl:if>
      <fo:block>
        <xsl:choose>
          <xsl:when test="@align='center'">
            <xsl:attribute name="text-align">center</xsl:attribute>
          </xsl:when>
          <xsl:when test="@align='right'">
            <xsl:attribute name="text-align">end</xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <xsl:attribute name="text-align">left</xsl:attribute>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates />
      </fo:block>
    </fo:table-cell>
  </xsl:template>
  
</xsl:stylesheet>
