"""Read-only production smoke audit. Usage: python3 scripts/audit-http.py URL"""
import concurrent.futures, json, re, sys, urllib.request, urllib.error
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit
base=(sys.argv[1] if len(sys.argv)>1 else 'http://localhost:3001').rstrip('/')
class Page(HTMLParser):
 def __init__(self):
  super().__init__(); self.lang='';self.direction='';self.ids=[];self.images=[];self.assets=[];self.links=[];self.meta={};self.title='';self.h1=0;self.in_title=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang');self.direction=a.get('dir')
  if a.get('id'):self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='title':self.in_title=True
  if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if tag=='a':self.links.append(a.get('href',''))
  if tag=='img':self.images.append(a)
  if tag in ['img','script'] and a.get('src'):self.assets.append(a['src'])
  if tag=='link' and a.get('rel') in ['stylesheet','preload','icon']:self.assets.append(a.get('href',''))
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
 def handle_data(self,data):
  if self.in_title:self.title+=data
ids=[5,4,1,3,2,6,7,8,9,10,11,12,14]
paths=['','/procedures','/contacts','/cosmetics','/address','/accessibility','/connection','/500']+[f'/treatments/{i}' for i in ids]
routes=[(prefix+path or '/',lang) for prefix,lang in [('', 'he'),('/en','en'),('/ru','ru')] for path in paths]
routes += [(prefix+path,lang) for prefix,lang in [('', 'he'),('/en','en'),('/ru','ru')] for path in ['/does-not-exist','/treatments/99999']]
def get(path):
 try:
  with urllib.request.urlopen(urllib.request.Request(urljoin(base+'/',path),headers={'User-Agent':'BeautyRoom-release-audit'}),timeout=30) as r:return r.status,r.geturl(),r.read(),dict(r.headers)
 except urllib.error.HTTPError as e:return e.code,e.geturl(),e.read(),dict(e.headers)
def audit(item):
 path,lang=item;status,url,raw,headers=get(path);p=Page();p.feed(raw.decode('utf-8','replace'));missing='does-not-exist' in path or '99999' in path
 findings=[]
 if missing:
  if status not in [200,404] or 'noindex' not in p.meta.get('robots',''): findings.append(f'error route HTTP {status} without noindex')
 elif status!=200: findings.append(f'HTTP {status}')
 if p.lang!=lang:findings.append(f'lang={p.lang}')
 if p.direction!=('rtl' if lang=='he' else 'ltr'):findings.append(f'dir={p.direction}')
 if not p.title:findings.append('missing title')
 if not missing and not p.meta.get('description'):findings.append('missing description')
 if not missing and '#main-content' in p.links and 'main-content' not in p.ids:findings.append('missing skip target')
 if len(p.ids)!=len(set(p.ids)):findings.append('duplicate IDs')
 if any('alt' not in i for i in p.images):findings.append('image missing alt')
 if lang=='he' and any('/fonts/' in x for x in p.assets):findings.append('Hebrew font preload')
 return {'path':path,'status':status,'lang':p.lang,'title':p.title,'findings':findings,'assets':p.assets,'links':p.links}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: results=list(pool.map(audit,routes))
assets=sorted({urljoin(base+'/',x) for p in results for x in p['assets'] if x and urlsplit(urljoin(base+'/',x)).netloc==urlsplit(base).netloc})
def asset(x):
 status,_,_,_=get(x);return {'url':x,'status':status}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: asset_results=list(pool.map(asset,assets))
report={'base':base,'pages':len(results),'assets':len(assets),'findings':[{'path':p['path'],'findings':p['findings']} for p in results if p['findings']],'failedAssets':[x for x in asset_results if x['status']!=200],'results':[{k:v for k,v in p.items() if k not in ['assets','links']} for p in results]}
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if report['findings'] or report['failedAssets'] else 0)
