#!/usr/bin/env python3
"""Package only verified public files. Does not deploy, send or approve a site."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import zipfile

ROOT=Path(__file__).resolve().parent.parent
def package(args):
    output=Path(args.output).resolve();site=output/'site';archive=Path(args.archive).resolve()
    if archive.exists() or archive.is_relative_to(site) or archive.is_relative_to(ROOT):raise ValueError('new private archive outside site/ and matrix required')
    subprocess.run([sys.executable,str(ROOT/'scripts/build-client.py'),'--config',args.config,'--output',str(output),'--release-check','--qa',args.qa],check=True)
    info=json.loads((output/'production-report.json').read_text())
    archive.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as bundle:
        for name in sorted(info['files']):
            raw=(site/name).read_bytes()
            if hashlib.sha256(raw).hexdigest()!=info['files'][name]:raise ValueError('public file changed during packaging: '+name)
            item=zipfile.ZipInfo(name,date_time=(2026,1,1,0,0,0));item.compress_type=zipfile.ZIP_DEFLATED;item.external_attr=0o644<<16;bundle.writestr(item,raw)
    print('OK: public-only ZIP; SHA256 '+hashlib.sha256(archive.read_bytes()).hexdigest())

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    for key in ('config','output','qa','archive'):p.add_argument('--'+key,required=True)
    try:package(p.parse_args())
    except (ValueError,OSError,KeyError,subprocess.CalledProcessError) as e:sys.exit('STOP: '+str(e))
