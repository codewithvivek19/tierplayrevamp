from html.parser import HTMLParser
from functools import lru_cache
from pathlib import Path
import json,re
class Node:
 def __init__(self,tag='',attrs=()): self.tag=tag;self.attrs=dict(attrs);self.children=[]
 @lru_cache(maxsize=None)
 def text(self): return re.sub(r'\s+',' ',''.join(c if isinstance(c,str) else c.text()+' ' for c in self.children)).strip()
class Parser(HTMLParser):
 def __init__(self): super().__init__();self.root=Node();self.stack=[self.root];self.nodes=[]
 def handle_starttag(self,t,a):
  n=Node(t,a);self.stack[-1].children.append(n);self.nodes.append(n)
  if t not in ['meta','link','img','input','br','hr','source','area','embed','wbr']:self.stack.append(n)
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==t:self.stack=self.stack[:i];break
 def handle_data(self,s):
  if not any(n.tag in ['script','style','noscript'] for n in self.stack):self.stack[-1].children.append(s)
out={}
for f in Path('docs/research').glob('*.html'):
 if f.name in ['fonts.html'] or f.name.startswith('wp-json'):continue
 p=Parser();p.feed(f.read_text(errors='replace')); ns=p.nodes
 out[f.name]={'text':p.root.text(), 'options':[n.text() for n in ns if n.tag=='option'], 'title':[n.text() for n in ns if n.tag=='title'], 'headings':[{'tag':n.tag,'text':n.text()} for n in ns if n.tag in ['h1','h2','h3','h4','h5','h6']], 'blocks':[{'tag':n.tag,'text':n.text()} for n in ns if n.tag in ['h1','h2','h3','h4','h5','h6','p','li','td','th','label','button'] and n.text()], 'links':[{'text':n.text(),'href':n.attrs.get('href','')} for n in ns if n.tag=='a'], 'forms':[n.attrs for n in ns if n.tag in ['form','input','select','textarea']], 'seo':[n.attrs for n in ns if n.tag=='meta' or (n.tag=='link' and n.attrs.get('rel') in ['canonical','alternate'])], 'assets':[n.attrs for n in ns if n.tag in ['img','video','source']], 'schema':[n.text() for n in ns if n.tag=='script' and n.attrs.get('type')=='application/ld+json']}
Path('docs/audit/evidence/extracted-pages.json').write_text(json.dumps(out,indent=2))
print('Extracted',len(out),'pages')
