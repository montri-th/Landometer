#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {validateSchema} from './schema-helpers.mjs';
import {rasterDimensions} from './raster-dimensions.mjs';
import {verifyPackage} from './verify.mjs';
try{
 const args=process.argv.slice(2);if(!args[0])throw Error('Usage: node scripts/validate-social.mjs sidecar.json --creative creative.png');const v=verifyPackage();if(v.status!=='PASS')throw Error('Package validation failed');
 const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),sidecar=JSON.parse(readFileSync(args[0],'utf8')),schema=JSON.parse(readFileSync(resolve(root,'assets/lds-0.9.5/machine/social-sidecar.schema.json'),'utf8'));
 const i=args.indexOf('--creative'),creative=i>=0?args[i+1]:resolve(dirname(args[0]),sidecar.artifact?.creativePath??'');if(!creative)throw Error('Creative path required');
 const problems=validateSchema(schema,sidecar),dims=rasterDimensions(creative,sidecar.artifact?.creativeMediaType),hash=createHash('sha256').update(readFileSync(creative)).digest('hex');
 const expected={'target.social.square.1080.01':{width:1080,height:1080},'target.social.og.1200x630.01':{width:1200,height:630}}[sidecar.artifact?.targetProfileRef];
 if(!expected||dims.width!==expected.width||dims.height!==expected.height)problems.push('Declared target and raster header dimensions differ');if(hash!==sidecar.artifact?.creativeSha256)problems.push('Creative hash mismatch');
 console.log(JSON.stringify({releaseRef:'v0.9.5-owner.1',status:problems.length?'FAIL':'PASS',schema:'social-sidecar.schema.json',dimensions:dims,expected,creativeSha256:hash,problems,scope:'Full inherited sidecar schema with square/OG targets, raster header geometry and creative hash; no decode, visual review or signed artifact conformance.',fullSignedConformance:false},null,2));process.exitCode=problems.length?1:0;
}catch(e){console.error('FAIL: '+e.message);process.exitCode=1;}
