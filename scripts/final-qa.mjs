import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
console.log('cookie accessibility', (await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations.map(v=>v.id));
await page.getByRole('button',{name:'Somente essenciais',exact:true}).click();
for(const file of await fs.readdir('public/images')){const r=await page.request.get('http://127.0.0.1:3000/images/'+file);if(r.status()!==200)throw Error(file+' missing')}
for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);await page.screenshot({path:'test-results/desktop-full.png',fullPage:true});
console.log('desktop accessibility',(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
await page.locator('.result-card').first().click();
console.log('modal accessibility',(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations.map(v=>v.id));await page.keyboard.press('Escape');
await page.getByRole('button',{name:'Política de Privacidade',exact:true}).last().click();console.log('privacy dialog',await page.locator('dialog').isVisible());await page.keyboard.press('Escape');
await page.setViewportSize({width:360,height:800});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.getByRole('button',{name:'Abrir menu',exact:true}).click();await page.keyboard.press('Escape');console.log('mobile escape',await page.locator('#menu-toggle').getAttribute('aria-expanded'));
await page.emulateMedia({reducedMotion:'reduce'});console.log('reduced motion',await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior));
await browser.close();console.log('All 15 image URLs returned 200.');
