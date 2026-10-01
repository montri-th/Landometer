#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2),option=k=>{const p=args.find(x=>x.startsWith(k+'='));if(p)return p.slice(k.length+1);const i=args.indexOf(k);return i<0?undefined:args[i+1];};
try{
 const family=option('--family'),theme=option('--theme')??'light',count=Number(option('--count')??7);
 const data=JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)),'../assets/lds-0.9.6/machine/color-srgb-09.scales.json'),'utf8'));
 const s=data.scales.find(s=>s.scaleId===family&&s.theme===theme);if(!s)throw Error('Unknown family/theme; choose an exact governed family ID and light|dark.');if(![3,5,7,9].includes(count))throw Error('Class count must be3,5,7or9.');
 const domain=option('--domain'),unit=option('--unit'),result={releaseRef:data.releaseRef,colorSetId:data.colorSetId,family,theme,kind:s.kind,count,scaleVersion:s.scaleVersion,lutIndices:Array.from({length:count},(_,i)=>Math.round(i*40/(count-1))),colors:s.classes[count],domain:null,thresholds:null,bins:null,unit:unit??null,classification:'not bound; consumer must provide domain, thresholds, unit and outlier policy',outlierPolicy:'explicit consumer decision required; never silently clamp'};
 if(domain!==undefined){const bounds=domain.split(',').map(Number);if(bounds.length!==2||!bounds.every(Number.isFinite)||bounds[0]>=bounds[1])throw Error('Domain must be two increasing finite numbers min,max.');if(!unit)throw Error('An explicit unit is required with domain.');const [min,max]=bounds;const midpoint=Number(option('--midpoint'));if(s.kind==='diverging'&&(!Number.isFinite(midpoint)||midpoint!==min+(max-min)/2))throw Error('Equal-interval diverging output requires explicit midpoint centered in domain. Supply custom reviewed thresholds outside this helper otherwise.');const edges=Array.from({length:count+1},(_,i)=>min+(max-min)*i/count);result.domain=bounds;result.thresholds=edges.slice(1,-1);result.classification='equal-interval (explicit opt-in; review analytical suitability)';result.bins=result.colors.map((color,i)=>({index:i,lower:edges[i],upper:edges[i+1],lowerInclusive:true,upperInclusive:i===count-1,color}));if(s.kind==='diverging')result.midpoint=midpoint;}
 console.log(JSON.stringify(result,null,2));
}catch(e){console.error(e.message);process.exitCode=1;}
