import {chromium} from '@playwright/test';
const b=await chromium.launch({channel:'chrome',headless:true});
try {
for(const width of [360,1440]) {
const p=await b.newPage({viewport:{width,height:900},reducedMotion:'no-preference'});
await p.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
await p.getByRole('button',{name:'Somente essenciais',exact:true}).click();
const target=p.locator('.about-copy');
const y=await target.evaluate(e=>e.getBoundingClientRect().top+scrollY);
await p.evaluate(y=>window.scrollTo({top:y-250,behavior:'instant'}),y);
await p.waitForTimeout(180);
const middle=await target.evaluate(e=>Number(getComputedStyle(e).opacity));
if(!(middle>0&&middle<1))throw Error('No fade transition: '+middle);
await p.waitForTimeout(1000);
if(await target.getAttribute('data-reveal')!=='visible')throw Error('Not revealed');
await p.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(100);
if(await target.getAttribute('data-reveal')!=='pending')throw Error('Not rearmed');
await p.evaluate(y=>window.scrollTo({top:y-250,behavior:'instant'}),y);await p.waitForTimeout(1000);
if(await target.evaluate(e=>getComputedStyle(e).opacity)!=='1')throw Error('Replay failed');
const questions=p.locator('.accordion summary');await questions.nth(0).click();await p.waitForTimeout(1000);await questions.nth(1).click();await p.waitForTimeout(300);console.log(await p.locator('.accordion details').evaluateAll(es=>es.map(e=>({open:e.open,html:e.outerHTML.slice(0,120)}))));
if(await p.locator('.accordion details[open]').count()!==1)throw Error('Multiple FAQ open');
if(!await p.locator('.accordion details').nth(1).evaluate(e=>e.open))throw Error('Wrong FAQ open');
await questions.nth(2).focus();await p.keyboard.press('Enter');await p.waitForTimeout(200);
if(await p.locator('.accordion details[open]').count()!==1)throw Error('Keyboard FAQ failed');
await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(100);
if(await target.evaluate(e=>getComputedStyle(e).transform)!=='none')throw Error('Reduced motion has translation');
if(await target.evaluate(e=>getComputedStyle(e).transitionProperty)!=='opacity')throw Error('Reduced fade missing');
console.log(width,'PASS fade opacity',middle,'replay, exclusive FAQ, keyboard, reduced motion');await p.close();
}
} finally {await b.close()}


