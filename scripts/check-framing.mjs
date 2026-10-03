import {chromium} from '@playwright/test';
const b=await chromium.launch({channel:'chrome',headless:true});
try {for(const [width,height] of [[1366,600],[1440,900],[1024,768],[768,1024],[360,800]]){
const p=await b.newPage({viewport:{width,height}});await p.goto('http://localhost:3000',{waitUntil:'networkidle'});await p.getByRole('button',{name:'Somente essenciais',exact:true}).click();await p.waitForTimeout(1500);
const result=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,hero:document.querySelector('.hero').getBoundingClientRect().height,ctaBottom:document.querySelector('.hero-actions').getBoundingClientRect().bottom}));console.log(width,height,result);if(result.overflow)throw Error('Overflow');
await p.screenshot({path:`test-results/framing-${width}.png`});await p.close();}
}finally{await b.close()}
