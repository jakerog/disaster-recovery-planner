import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        # 1. Login
        print("Logging in...")
        await page.goto("http://localhost:3000/login")
        await page.fill("input[type='email']", "admin@sentinel.com")
        await page.fill("input[type='password']", "password123")
        await page.click("button[type='submit']")
        await page.wait_for_url("http://localhost:3000/")
        await page.screenshot(path="verification/v2_home.png")

        # 2. Mission Control
        print("Verifying Mission Control...")
        await page.goto("http://localhost:3000/exercises")
        await page.wait_for_selector("text=Mission Control")
        await page.screenshot(path="verification/v2_exercises_list.png")

        # Click first exercise
        await page.click("text=Q1 Global Recovery Simulation")
        await page.wait_for_selector("text=Sentinel Tactical Monitor")
        await page.screenshot(path="verification/v2_mission_control.png")

        # 3. Admin Personnel Registry
        print("Verifying Admin Pages...")
        await page.goto("http://localhost:3000/admin/resources")
        await page.wait_for_selector("text=Personnel Registry")
        await page.screenshot(path="verification/v2_personnel.png")

        # 4. Admin Templates
        await page.goto("http://localhost:3000/admin/email-templates")
        await page.wait_for_selector("text=Transmission Protocols")
        await page.screenshot(path="verification/v2_templates.png")

        # 5. Admin Scheduler
        await page.goto("http://localhost:3000/admin/email-scheduler")
        await page.wait_for_selector("text=Transmission Command")
        await page.screenshot(path="verification/v2_scheduler.png")

        await browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    asyncio.run(verify())
