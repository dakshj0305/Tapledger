/* Rebuild the single runtime stylesheet from maintained source layers. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const layers=['style.css','design-system.css','motion-ui.css','liquid-metal.css','polish.css','voltura-visual-system.css','voltura-visual-overhaul.css','stitch-integration.css','atelier.css'];
function flattenGradients(text){
 const out=[];let i=0;
 while(i<text.length){
  const match=/(?:linear|radial|conic)-gradient\(/i.exec(text.slice(i));
  if(!match){out.push(text.slice(i));break}
  const start=i+match.index;out.push(text.slice(i,start));let j=start+match[0].length,depth=1,quote=null;
  while(j<text.length&&depth){const c=text[j];if(quote){if(c===quote&&text[j-1]!=='\\')quote=null}else if(c==='"'||c==="'")quote=c;else if(c==='(')depth++;else if(c===')')depth--;j++}
  out.push('var(--v26-surface)');i=j;
 }
 return out.join('');
}
function build(){
 let base=layers.map(name=>`\n/* ===== Source layer: ${name} ===== */\n${fs.readFileSync(path.join(root,name),'utf8').trimEnd()}\n`).join('');
 base=base.replace(/backdrop-filter\s*:\s*blur\([^)]*\)/gi,'backdrop-filter:none')
  .replace(/filter\s*:\s*blur\([^)]*\)/gi,'filter:none')
  .replace(/text-shadow\s*:[^;}]*;?/gi,'text-shadow:none;')
  .replace(/box-shadow\s*:[^;}]*;?/gi,'box-shadow:none;');
 return flattenGradients(base)+fs.readFileSync(path.join(root,'voltura-unified-overrides.css'),'utf8');
}
if(require.main===module){fs.writeFileSync(path.join(root,'voltura.css'),build());process.stdout.write('Built voltura.css from '+layers.length+' source layers.\n')}
module.exports={build,layers};
