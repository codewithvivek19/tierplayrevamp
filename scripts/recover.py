import urllib.request,ssl,re,json,pathlib,concurrent.futures,hashlib,subprocess
root=pathlib.Path(__file__).resolve().parent.parent
# Public legacy host has a mismatched certificate. No credentials or private endpoints used.
ctx=ssl._create_unverified_context()
def get(url):
 try:return subprocess.check_output(['curl','-kLsS','--max-time','30',url],stderr=subprocess.DEVNULL)
 except Exception:return b''
pages=['','cabinets/','games/','products/','player-journey/','sunscape-1/','sunscape-2/','sunscape-3/','sunscape-4/','sunscape-5/','sunscape-6/','sitemap_index.xml','wp-json/wp/v2/media?per_page=100']
def page(p):
 u='https://electronhubs.com/'+p;b=get(u);name=p.replace('/','_').replace('?','_') or 'home';(root/'docs/research'/ (name+'.html')).write_bytes(b);return u,b.decode(errors='ignore')
sources=list(concurrent.futures.ThreadPoolExecutor(max_workers=6).map(page,pages));items={}
for pageurl,s in sources:
 for u in re.findall(r'https?[^\s"<>]+?\.(?:png|jpg|jpeg|webp|svg|pdf|mp4|glb|gltf)',s.replace('\\/','/')):
  if '/uploads/' not in u or re.search(r'-\d+x\d+\.',u):continue
  items.setdefault(u,[]).append(pageurl)
def asset(pair):
 u,p=pair;name=u.rsplit('/',1)[-1];low=name.lower();cat='cabinets' if any(x in low for x in ['cabinet','curved','vertical','console']) else 'brand' if any(x in low for x in ['tierplay','favicon']) else 'games' if any(x in low for x in ['sunscape','dragon','bison','tiki','rich','evil','war','eagle','bandit','sinister']) else 'unknown';dest=root/'assets/source-recovery'/cat/name;dest.parent.mkdir(parents=True,exist_ok=True);b=get(u)
 if not b:return {'original':u,'recovered':False}
 dest.write_bytes(b);return {'id':name.rsplit('.',1)[0],'source':p,'original':u,'local':str(dest.relative_to(root)),'type':name.rsplit('.',1)[-1],'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'copyrightStatus':'Presumed Tierplay legacy marketing; owner confirmation required','recovered':True,'generated':False,'approved':False,'quality':'Pending visual review','replacementRequired':'Pending review'}
result=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(asset,items.items()));(root/'assets/manifest.json').write_text(json.dumps(result,indent=2));print('Recovered',sum(x['recovered'] for x in result),'of',len(result));print('\n'.join(x.get('local',x['original']) for x in result))
