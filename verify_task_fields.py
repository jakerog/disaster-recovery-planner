import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(record_video_dir="/home/jules/verification/videos")
        page = await context.new_page()

        print("Logging in...")
        await page.goto("http://localhost:3000/login")
        await page.fill("input[type='email']", "jake.rog@gmail.com")
        await page.fill("input[type='password']", "password123")
        await page.click("button[type='submit']")
        await page.wait_for_timeout(2000)

        print("Navigating to Tasks...")
        await page.goto("http://localhost:3000/admin/tasks")
        await page.wait_for_timeout(2000)

        print("Opening New Task form...")
        await page.get_by_role("button", name="New Task").click()
        await page.wait_for_timeout(1000)

        print("Verifying form fields...")
        # Take screenshot of the form
        await page.screenshot(path="/home/jules/verification/screenshots/task_form.png")

        # Check for new fields
        await page.wait_for_selector("input[name='name']")
        await page.wait_for_selector("input[name='taskId'][type='number']")

        print("Closing...")
        await context.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
