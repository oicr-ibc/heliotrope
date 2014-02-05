use common::sense;

use Test::More;

use MediaWiki::Parser;

my $parser = MediaWiki::Parser->new();
$parser->parse(get_content());

done_testing();

sub get_content {
	return <<"__EOF__";
{{PBB|geneid=3290}}
'''11β-hydroxysteroid dehydrogenase type 1''', or 'cortisone reductase' is an [[NADPH]]-dependent [[enzyme]] highly expressed in key metabolic tissues including [[liver]], [[adipose]] tissue, and the [[central nervous system]].

In these tissues, '''HSD11B1''' reduces [[cortisone]] to the active hormone [[cortisol]] that activates [[glucocorticoid receptor]]s.

It is inhibited by [[carbenoxolone]], a drug typically used in the treatment of [[peptic ulcer]]s.

The protein encoded by this gene is a microsomal enzyme that catalyzes the conversion of the stress hormone [[cortisol]] to the inactive [[metabolite]] [[cortisone]]. In addition, the encoded protein can catalyze the reverse reaction, the conversion of cortisone to cortisol. Too much cortisol can lead to central [[obesity]], and a particular variation in this gene has been associated with obesity and [[insulin resistance]] in children. Two transcript variants encoding the same protein have been found for this gene.<ref name="entrez">{{cite web | title = Entrez Gene: HSD11B1 hydroxysteroid (11-beta) dehydrogenase 1| url = http://www.ncbi.nlm.nih.gov/sites/entrez?Db=gene&Cmd=ShowDetailView&TermToSearch=3290| accessdate = }}</ref>

==See also==
* [[Cortisone reductase deficiency]]

==References==
{{reflist}}

==Further reading==
{{refbegin | 2}}
{{PBB_Further_reading
| citations =
*{{cite journal  | author=White PC, Mune T, Agarwal AK |title=11 beta-Hydroxysteroid dehydrogenase and the syndrome of apparent mineralocorticoid excess. |journal=Endocr. Rev. |volume=18 |issue= 1 |pages= 135–56 |year= 1997 |pmid= 9034789 |doi=10.1210/er.18.1.135  }}
*{{cite journal  | author=Agarwal AK |title=Cortisol metabolism and visceral obesity: role of 11beta-hydroxysteroid dehydrogenase type I enzyme and reduced co-factor NADPH. |journal=Endocr. Res. |volume=29 |issue= 4 |pages= 411–8 |year= 2004 |pmid= 14682470 |doi=10.1081/ERC-120026947  }}
*{{cite journal  | author=Tomlinson JW |title=11beta-hydroxysteroid dehydrogenase type 1: a tissue-specific regulator of glucocorticoid response |journal=Endocr. Rev. |volume=25 |issue= 5 |pages= 831–66 |year= 2005 |pmid= 15466942 |doi= 10.1210/er.2003-0031  | author-separator=,  | author2=Walker EA  | author3=Bujalska IJ  | display-authors=3  | last4=Draper  | first4=N  | last5=Lavery  | first5=GG  | last6=Cooper  | first6=MS  | last7=Hewison  | first7=M  | last8=Stewart  | first8=PM }}
*{{cite journal  | author=Odermatt A |title=Why is 11beta-hydroxysteroid dehydrogenase type 1 facing the endoplasmic reticulum lumen? Physiological relevance of the membrane topology of 11beta-HSD1 |journal=Mol. Cell. Endocrinol. |volume=248 |issue= 1–2 |pages= 15–23 |year= 2006 |pmid= 16412558 |doi= 10.1016/j.mce.2005.11.040  | author-separator=,  | author2=Atanasov AG  | author3=Balazs Z  | display-authors=3  | last4=Schweizer  | first4=Roberto A.S.  | last5=Nashev  | first5=Lyubomir G.  | last6=Schuster  | first6=Daniela  | last7=Langer  | first7=Thierry }}
*{{cite journal  | author=Wake DJ, Walker BR |title=Inhibition of 11beta-hydroxysteroid dehydrogenase type 1 in obesity |journal=Endocrine |volume=29 |issue= 1 |pages= 101–8 |year= 2006 |pmid= 16622297 |doi=10.1385/ENDO:29:1:101  }}
*{{cite journal  | author=Tannin GM |title=The human gene for 11 beta-hydroxysteroid dehydrogenase. Structure, tissue distribution, and chromosomal localization |journal=J. Biol. Chem. |volume=266 |issue= 25 |pages= 16653–8 |year= 1991 |pmid= 1885595 |doi=  | author-separator=,  | author2=Agarwal AK  | author3=Monder C  | display-authors=3  | last4=New  | first4=MI  | last5=White  | first5=PC  }}
*{{cite journal  | author=Graham DL, Oram JF |title=Identification and characterization of a high density lipoprotein-binding protein in cell membranes by ligand blotting |journal=J. Biol. Chem. |volume=262 |issue= 16 |pages= 7439–42 |year= 1987 |pmid= 3034894 |doi=  }}
*{{cite journal  | author=Whorwood CB |title=Detection of human 11 beta-hydroxysteroid dehydrogenase isoforms using reverse-transcriptase-polymerase chain reaction and localization of the type 2 isoform to renal collecting ducts |journal=Mol. Cell. Endocrinol. |volume=110 |issue= 1–2 |pages= R7–12 |year= 1995 |pmid= 7545619 |doi=10.1016/0303-7207(95)03546-J  | author-separator=,  | author2=Mason JI  | author3=Ricketts ML  | display-authors=3  | last4=Howie  | first4=A.J.  | last5=Stewart  | first5=P.M.  }}
*{{cite journal  | author=Mune T |title=Human hypertension caused by mutations in the kidney isozyme of 11 beta-hydroxysteroid dehydrogenase |journal=Nat. Genet. |volume=10 |issue= 4 |pages= 394–9 |year= 1995 |pmid= 7670488 |doi= 10.1038/ng0895-394  | author-separator=,  | author2=Rogerson FM  | author3=Nikkilä H  | display-authors=3  | last4=Agarwal  | first4=Anil K.  | last5=White  | first5=Perrin C. }}
*{{cite journal  | author=Ricketts ML |title=Immunohistochemical localization of type 1 11beta-hydroxysteroid dehydrogenase in human tissues |journal=J. Clin. Endocrinol. Metab. |volume=83 |issue= 4 |pages= 1325–35 |year= 1998 |pmid= 9543163 |doi=10.1210/jc.83.4.1325  | author-separator=,  | author2=Verhaeg JM  | author3=Bujalska I  | display-authors=3  | last4=Howie  | first4=AJ  | last5=Rainey  | first5=WE  | last6=Stewart  | first6=PM  }}
*{{cite journal  | author=Calvo D |title=Human CD36 is a high affinity receptor for the native lipoproteins HDL, LDL, and VLDL |journal=J. Lipid Res. |volume=39 |issue= 4 |pages= 777–88 |year= 1998 |pmid= 9555943 |doi=  | author-separator=,  | author2=Gómez-Coronado D  | author3=Suárez Y  | display-authors=3  | last4=Lasunción  | first4=MA  | last5=Vega  | first5=MA  }}
*{{cite journal  | author=Odermatt A |title=The N-terminal anchor sequences of 11beta-hydroxysteroid dehydrogenases determine their orientation in the endoplasmic reticulum membrane |journal=J. Biol. Chem. |volume=274 |issue= 40 |pages= 28762–70 |year= 1999 |pmid= 10497248 |doi=10.1074/jbc.274.40.28762  | author-separator=,  | author2=Arnold P  | author3=Stauffer A  | display-authors=3  | last4=Frey  | first4=BM  | last5=Frey  | first5=FJ  }}
*{{cite journal  | author=Sriskanda V, Schwer B, Ho CK, Shuman S |title=Mutational analysis of Escherichia coli DNA ligase identifies amino acids required for nick-ligation in vitro and for in vivo complementation of the growth of yeast cells deleted for CDC9 and LIG4 |journal=Nucleic Acids Res. |volume=27 |issue= 20 |pages= 3953–63 |year= 1999 |pmid= 10497258 |doi=10.1093/nar/27.20.3953  | pmc=148661  }}
*{{cite journal  | author=Schutte BC |title=A Preliminary Gene Map for the Van der Woude Syndrome Critical Region Derived from 900 kb of Genomic Sequence at 1q32–q41 |journal=Genome Res. |volume=10 |issue= 1 |pages= 81–94 |year= 2000 |pmid= 10645953 |doi=  10.1101/gr.10.1.81| pmc=310500  | author-separator=,  | author2=Bjork BC  | author3=Coppage KB  | display-authors=3  | last4=Malik  | first4=MI  | last5=Gregory  | first5=SG  | last6=Scott  | first6=DJ  | last7=Brentzell  | first7=LM  | last8=Watanabe  | first8=Y  | last9=Dixon  | first9=MJ  }}
*{{cite journal  | author=Cooper MS |title=Expression and functional consequences of 11beta-hydroxysteroid dehydrogenase activity in human bone |journal=Bone |volume=27 |issue= 3 |pages= 375–81 |year= 2000 |pmid= 10962348 |doi=10.1016/S8756-3282(00)00344-6  | author-separator=,  | author2=Walker EA  | author3=Bland R  | display-authors=3  | last4=Fraser  | first4=W.D  | last5=Hewison  | first5=M  | last6=Stewart  | first6=P.M  }}
*{{cite journal  | author=Reddy ST |title=Human paraoxonase-3 is an HDL-associated enzyme with biological activity similar to paraoxonase-1 protein but is not regulated by oxidized lipids |journal=Arterioscler. Thromb. Vasc. Biol. |volume=21 |issue= 4 |pages= 542–7 |year= 2001 |pmid= 11304470 |doi=  10.1161/01.ATV.21.4.542  | author-separator=,  | author2=Wadleigh DJ  | author3=Grijalva V  | display-authors=3  | last4=Ng  | first4=C.  | last5=Hama  | first5=S.  | last6=Gangopadhyay  | first6=A.  | last7=Shih  | first7=D. M.  | last8=Lusis  | first8=A. J.  | last9=Navab  | first9=M.}}
*{{cite journal  | author=Pácha J, Lisá V, Miksík I |title=Effect of cellular differentiation on 11beta-hydroxysteroid dehydrogenase activity in the intestine |journal=Steroids |volume=67 |issue= 2 |pages= 119–26 |year= 2002 |pmid= 11755176 |doi=10.1016/S0039-128X(01)00143-X  }}
*{{cite journal  | author=Albertin G |title=Human adrenal cortex and aldosterone secreting adenomas express both 11beta-hydroxysteroid dehydrogenase type 1 and type 2 genes |journal=Int. J. Mol. Med. |volume=9 |issue= 5 |pages= 495–8 |year= 2002 |pmid= 11956655 |doi=  | author-separator=,  | author2=Tortorella C  | author3=Malendowicz LK  | display-authors=3  | last4=Aragona  | first4=F  | last5=Neri  | first5=G  | last6=Nussdorfer  | first6=GG  }}
*{{cite journal  | author=Mazzocchi G |title=11beta-Hydroxysteroid dehydrogenase types 1 and 2 are up- and downregulated in cortisol-secreting adrenal adenomas |journal=J. Investig. Med. |volume=50 |issue= 4 |pages= 288–92 |year= 2002 |pmid= 12109593 |doi=10.2310/6650.2002.33012  | author-separator=,  | author2=Malendowicz LK  | author3=Aragona F  | display-authors=3  | last4=Tortorella  | first4=Cinzia  | last5=Gottardo  | first5=Lucia  | last6=Nussdorfer  | first6=Gastone G.  }}
}}
{{refend}}
{{PDB Gallery|geneid=3290}}

{{Alcohol oxidoreductases}}
{{Steroid metabolism enymes}}

<!-- The PBB_Controls template provides controls for Protein Box Bot, please see Template:PBB_Controls for details. -->
{{PBB_Controls
| update_page = yes
| require_manual_inspection = no
| update_protein_box = yes
| update_summary = no
| update_citations = yes
}}

{{DEFAULTSORT:11b-Hydroxysteroid Dehydrogenase Type 1}}
[[Category:EC 1.1.1]]
[[Category:Human proteins]]


{{1.1.1-enzyme-stub}}
__EOF__

};

1;