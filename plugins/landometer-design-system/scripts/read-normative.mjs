#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export function readNormative(file){
 const source=readFileSync(file,'utf8');
 let value;
 if(file.endsWith('.json')) value=JSON.parse(source);
 else {
  const marker='\n<!-- LDS_MACHINE_BEGIN -->\n```json\n';
  const end='\n```\n<!-- LDS_MACHINE_END -->\n';
  const split=source.indexOf(marker);
  if(split<0||source.indexOf(marker,split+1)>=0||!source.endsWith(end))throw Error('Expected one complete machine block');
  const humanMarkdown=source.slice(0,split);
  const machine=JSON.parse(source.slice(split+marker.length,-end.length));
  value={document:machine.document,humanMarkdown,machine};
 }
 const hash=createHash('sha256').update(value.humanMarkdown).digest('hex');
 if(value.document.humanSha256!==hash)throw Error('Human document hash mismatch');
 if(JSON.stringify(value.document)!==JSON.stringify(value.machine.document))throw Error('Document identities disagree');
 if(value.document.dsVersion!=='0.9.7'||value.document.colorSetId!=='color-srgb-10'||value.document.releaseRef!=='v0.9.7-owner.1')throw Error('Unexpected LDS identity');
 return value;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{
  const file=process.argv.slice(2).find(x=>!x.startsWith('--'));
  if(!file)throw Error('Usage: node scripts/read-normative.mjs standalone.md [--summary]');
  const value=readNormative(file);
  console.log(JSON.stringify(process.argv.includes('--summary')?{...value.document,documentKind:value.document.documentKind??'base',ruleCount:value.machine.ruleCatalog?.rules.length??0,scaleRecords:value.machine.analyticalScales?.scales.length??0,assetFiles:value.machine.assetFiles?.length??0,...(value.machine.baseDocument?{requiresBase:value.machine.baseDocument}:{})}:value,null,2));
 }catch(e){console.error(e.message);process.exitCode=1;}
}
