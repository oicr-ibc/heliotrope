<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:svg="http://www.w3.org/2000/svg"
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
  
  <xsl:template match="html:svg">
    <fo:instream-foreign-object>
      <svg:svg>
        <xsl:attribute name="width"><xsl:value-of select="@width * 0.82"/></xsl:attribute>
        <xsl:attribute name="height"><xsl:value-of select="@height * 0.82"/></xsl:attribute>
        <svg:g>
          <xsl:attribute name="transform"><xsl:text>scale(0.82, 0.82)</xsl:text></xsl:attribute>
          <xsl:apply-templates>
            <xsl:with-param name="class" select="''"/>
          </xsl:apply-templates>
      </svg:g>
      </svg:svg>
    </fo:instream-foreign-object>
  </xsl:template>

  <xsl:template match="html:g">
    <xsl:param name="class"/>
    <svg:g>
      <xsl:attribute name="transform"><xsl:value-of select="@transform"/></xsl:attribute>
      <xsl:attribute name="class"><xsl:value-of select="normalize-space(concat($class, ' ', @class))"/></xsl:attribute>
      <xsl:apply-templates>
        <xsl:with-param name="class" select="normalize-space(concat($class, ' ', @class))"/>
      </xsl:apply-templates>
    </svg:g>
  </xsl:template>
  
  <xsl:template match="html:line">
    <xsl:param name="class"/>
    <svg:line>
      <xsl:if test="@x1"><xsl:attribute name="x1"><xsl:value-of select="@x1"/></xsl:attribute></xsl:if>
      <xsl:if test="@y1"><xsl:attribute name="y1"><xsl:value-of select="@y1"/></xsl:attribute></xsl:if>
      <xsl:if test="@x2"><xsl:attribute name="x2"><xsl:value-of select="@x2"/></xsl:attribute></xsl:if>
      <xsl:if test="@y2"><xsl:attribute name="y2"><xsl:value-of select="@y2"/></xsl:attribute></xsl:if>
      <xsl:choose>
        <xsl:when test="$class = 'axis tick major'">
          <xsl:attribute name="stroke"><xsl:text>#aaa</xsl:text></xsl:attribute>
          <xsl:attribute name="stroke-width"><xsl:text>0.5px</xsl:text></xsl:attribute>
        </xsl:when>
      </xsl:choose>

      <xsl:apply-templates />
    </svg:line>
  </xsl:template>
  
  <xsl:template match="html:text">
    <svg:text>
      <xsl:if test="@transform"><xsl:attribute name="transform"><xsl:value-of select="@transform"/></xsl:attribute></xsl:if>
      <xsl:if test="@x"><xsl:attribute name="x"><xsl:value-of select="@x"/></xsl:attribute></xsl:if>
      <xsl:if test="@y"><xsl:attribute name="y"><xsl:value-of select="@y"/></xsl:attribute></xsl:if>
      <xsl:if test="@dx"><xsl:attribute name="dx"><xsl:value-of select="@dx"/></xsl:attribute></xsl:if>
      <xsl:if test="@dy"><xsl:attribute name="dy"><xsl:value-of select="@dy"/></xsl:attribute></xsl:if>
      <xsl:if test="@style"><xsl:attribute name="style"><xsl:value-of select="@style"/></xsl:attribute></xsl:if>
      <xsl:apply-templates />
    </svg:text>
  </xsl:template>

  <xsl:template match="html:rect">
    <svg:rect>
      <xsl:if test="@x"><xsl:attribute name="x"><xsl:value-of select="@x"/></xsl:attribute></xsl:if>
      <xsl:if test="@y"><xsl:attribute name="y"><xsl:value-of select="@y"/></xsl:attribute></xsl:if>
      <xsl:if test="@width"><xsl:attribute name="width"><xsl:value-of select="@width"/></xsl:attribute></xsl:if>
      <xsl:if test="@height"><xsl:attribute name="height"><xsl:value-of select="@height"/></xsl:attribute></xsl:if>
      <xsl:if test="@rx"><xsl:attribute name="rx"><xsl:value-of select="@rx"/></xsl:attribute></xsl:if>
      <xsl:if test="@ry"><xsl:attribute name="ry"><xsl:value-of select="@ry"/></xsl:attribute></xsl:if>
      <xsl:if test="@fill"><xsl:attribute name="fill"><xsl:value-of select="@fill"/></xsl:attribute></xsl:if>
      <xsl:apply-templates />
    </svg:rect>
  </xsl:template>
  
  <xsl:template match="html:path">
    <xsl:param name="class"/>
    <svg:path>
      <xsl:attribute name="d"><xsl:value-of select="@d"/></xsl:attribute>
      <xsl:attribute name="class"><xsl:value-of select="normalize-space(concat($class, ' ', @class))"/></xsl:attribute>
      <xsl:choose>
        <xsl:when test="normalize-space(concat($class, ' ', @class)) = 'axis domain'">
          <xsl:attribute name="stroke"><xsl:text>#aaa</xsl:text></xsl:attribute>
          <xsl:attribute name="stroke-width"><xsl:text>0.5</xsl:text></xsl:attribute>
          <xsl:attribute name="fill"><xsl:text>none</xsl:text></xsl:attribute>
        </xsl:when>
        <xsl:when test="normalize-space(concat($class, ' ', @class)) = 'marker marker-selected'">
          <xsl:attribute name="stroke"><xsl:text>black</xsl:text></xsl:attribute>
          <xsl:attribute name="stroke-width"><xsl:text>0.5</xsl:text></xsl:attribute>
          <xsl:attribute name="fill"><xsl:text>none</xsl:text></xsl:attribute>
        </xsl:when>
        <xsl:when test="normalize-space(concat($class, ' ', @class)) = 'marker marker-unselected'">
          <xsl:attribute name="stroke"><xsl:text>#aaa</xsl:text></xsl:attribute>
          <xsl:attribute name="stroke-width"><xsl:text>0.5</xsl:text></xsl:attribute>
          <xsl:attribute name="fill"><xsl:text>none</xsl:text></xsl:attribute>
        </xsl:when>
      </xsl:choose>

      <xsl:apply-templates />
    </svg:path>
  </xsl:template>
  
  <xsl:template match="html:circle">
    <xsl:param name="class"/>
    <svg:circle>
      <xsl:attribute name="cx"><xsl:value-of select="sum(@cx)"/><xsl:text>px</xsl:text></xsl:attribute>
      <xsl:attribute name="cy"><xsl:value-of select="sum(@cy)"/><xsl:text>px</xsl:text></xsl:attribute>
      <xsl:attribute name="r"><xsl:value-of select="sum(@r)"/><xsl:text>px</xsl:text></xsl:attribute>
      <xsl:attribute name="class"><xsl:value-of select="normalize-space(concat($class, ' ', @class))"/></xsl:attribute>
      <xsl:choose>
        <xsl:when test="normalize-space(concat($class, ' ', @class)) = 'marker marker-selected'">
          <xsl:attribute name="fill"><xsl:text>#a22</xsl:text></xsl:attribute>
        </xsl:when>
        <xsl:when test="normalize-space(concat($class, ' ', @class)) = 'marker marker-unselected'">
          <xsl:attribute name="fill"><xsl:text>#aaa</xsl:text></xsl:attribute>
        </xsl:when>
      </xsl:choose>
      <xsl:apply-templates />
    </svg:circle>
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
