from pathlib import Path
import subprocess,json,hashlib,concurrent.futures
routes=['/','/cabinets/','/games/','/products/','/player-journey/','/up-to-date/','/our_games/sunscapes/']+['/our_games/sunscape-'+str(i)+'/' for i in range(2,7)]
def fetch(route):
 name='live-'+(route.strip('/').replace('/','_') or 'home')+'.html'; dest=Path('docs/research')/name
 p=subprocess.run(['curl','-kLsS','--max-time','25','-o',str(dest),'-w','%{http_code}|%{url_effective}|%{content_type}','https://electronhubs.com'+route],capture_output=True,text=True)
 b=dest.read_bytes() if dest.exists() else b''
 return {'route':route,'file':str(dest),'status':p.stdout,'error':p.stderr,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'transport':'TLS certificate mismatch; public unauthenticated read using certificate verification bypass. Not verified secure transport.'}
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(fetch,routes));Path('docs/audit/evidence/fetch-log.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
