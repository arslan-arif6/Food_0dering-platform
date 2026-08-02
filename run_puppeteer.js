const puppeteer = require('puppeteer');
const fs = require('fs');

async function measureDimensions(page) {
    return await page.evaluate(() => {
        return JSON.stringify({
            bodyScrollWidth: document.body.scrollWidth,
            bodyClientWidth: document.body.clientWidth,
            bodyOffsetWidth: document.body.offsetWidth,
            windowInnerWidth: window.innerWidth,
            bodyOverflow: document.body.style.overflow,
            htmlOverflow: document.documentElement.style.overflow
        });
    });
}

async function runTest(width) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: width, height: 812, deviceScaleFactor: 2 });
    
    // Navigate to page
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    
    // Take full page screenshot to debug
    await page.screenshot({ path: `qa_screenshots/debug_${width}.png`, fullPage: true });
    
    console.log(`--- Testing at ${width}px ---`);
    
    // Wait for data to load
    await new Promise(r => setTimeout(r, 2000));
    
    // 1. Screenshot before opening
    await page.screenshot({ path: `qa_screenshots/home_${width}_closed.png` });
    
    // 2. Measure dimensions
    const before = await measureDimensions(page);
    console.log(`Before opening at ${width}px:`, before);
    
    // 3. Find '+' button for a multi-variant dish
    await page.evaluate(() => {
        const xpath = "//div[contains(text(), 'From Rs.')]";
        const textNodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < textNodes.snapshotLength; i++) {
            let node = textNodes.snapshotItem(i);
            // Traverse up to find the container
            let container = node.closest('div[class*="relative"]') || node.closest('div[class*="rounded-2xl"]') || node.parentElement.parentElement.parentElement;
            if (container) {
                const btn = container.querySelector('button');
                if (btn) {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => btn.click(), 500);
                    return;
                }
            }
        }
        
        // Fallback if XPath fails:
        const spans = Array.from(document.querySelectorAll('*')).filter(s => s.innerText && s.innerText.includes('From Rs.'));
        if(spans.length > 0) {
            const parent = spans[0].closest('div[class*="rounded"]');
            if (parent) {
                const btn = parent.querySelector('button');
                if (btn) {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => btn.click(), 500);
                    return;
                }
            }
        }
    });
    
    // Wait for scroll and the bottom sheet to open
    await new Promise(r => setTimeout(r, 1500));
    
    // 4. Screenshot after opening
    await page.screenshot({ path: `qa_screenshots/home_${width}_open.png` });
    
    // 5. Measure dimensions
    const after = await measureDimensions(page);
    console.log(`After opening at ${width}px:`, after);
    
    await browser.close();
}

(async () => {
    try {
        await runTest(375);
        // await runTest(320); // skip 320 for now to debug 375
    } catch (e) {
        console.error("Error running test:", e);
    }
})();
