const fs=require('fs');
eval(fs.readFileSync(__dirname+'/questions.js','utf8')+fs.readFileSync(__dirname+'/drills.js','utf8')+';global.Q=QUESTIONS.concat(DRILLS);');
function rng(seed){let a=seed>>>0;const f=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};return{f,int:(lo,hi)=>lo+Math.floor(f()*(hi-lo+1)),pick:arr=>arr[Math.floor(f()*arr.length)]}}
const out=[];
for(const q of Q){for(const seed of [11,222,3333,9999,123456]){const r=rng(seed);let p=q.params(r);if(q.fix)p=q.fix(p);out.push({id:q.id,seed,params:p,setup:q.setup,check:q.check,banned:q.banned||[],solution:q.solution(p),starter:q.starter,prompt:q.prompt(p)});}}
fs.writeFileSync(__dirname+'/dump.json',JSON.stringify(out));
console.log(out.length);
