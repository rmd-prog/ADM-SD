from pathlib import Path
import json

src=Path('lkpd.html').read_text(encoding='utf-8')
marker='const curriculum='
pos=src.find(marker)
if pos<0: raise SystemExit('const curriculum= tidak ditemukan di lkpd.html')
start=src.find('{',pos+len(marker))
if start<0: raise SystemExit('awal curriculum tidak ditemukan')
depth=0; in_str=False; quote=''; esc=False; end=-1
for i in range(start,len(src)):
    c=src[i]
    if in_str:
        if esc: esc=False
        elif c=='\\': esc=True
        elif c==quote: in_str=False
        continue
    if c in ('"',"'",'`'):
        in_str=True; quote=c; continue
    if c=='{': depth+=1
    elif c=='}':
        depth-=1
        if depth==0:
            end=i+1; break
if end<0: raise SystemExit('akhir curriculum tidak ditemukan')
raw=src[start:end]
# lkpd.html uses JavaScript object literals. Evaluate only the literal in a controlled Node process.
import subprocess, tempfile
js="const x="+raw+";process.stdout.write(JSON.stringify(x));"
proc=subprocess.run(['node','-e',js],capture_output=True,text=True)
if proc.returncode!=0:
    raise SystemExit('Gagal membaca curriculum: '+proc.stderr[:1000])
data=json.loads(proc.stdout)
out=Path('assets/curriculum-data.js')
out.write_text('window.ADM_CURRICULUM='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Generated',out,'subjects=',len(data),'classes=',sorted({str(k) for v in data.values() if isinstance(v,dict) for k in v.keys()}))
