import asyncio
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        # Using chromium, which is generally available.
        # The warnings from `playwright install` are a concern, but we proceed.
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local built file
        file_path = "file:///app/clinic-inventory-system/frontend/build/index.html"
        print(f"Navigating to {file_path}...")
        page.goto(file_path)

        # 1. Assert that the main heading is visible
        print("Checking for main heading...")
        heading = page.get_by_role("heading", name="Clinic Vaccine Inventory (Demo Mode)")
        expect(heading).to_be_visible()
        print("Heading is visible.")

        # 2. Take a screenshot of the initial state
        initial_screenshot_path = "jules-scratch/verification/initial_view.png"
        page.screenshot(path=initial_screenshot_path)
        print(f"Initial screenshot saved to {initial_screenshot_path}")

        # 3. Click the button to show the form
        print("Clicking 'Add New Inventory Lot' button...")
        add_button = page.get_by_role("button", name="Add New Inventory Lot")
        add_button.click()

        # 4. Fill out the form
        print("Filling out the form...")
        # Select vaccine from dropdown
        page.get_by_role("combobox").select_option(label="COVID-19 - Pfizer")
        # Fill lot number
        page.get_by_placeholder("Lot Number").fill("PFIZER-DEMO-007")
        # Fill quantity
        page.get_by_placeholder("Quantity").fill("75")
        # Fill expiration date
        page.get_by_placeholder("Expiration Date").fill("2027-07-31")

        # 5. Submit the form
        print("Submitting the form...")
        submit_button = page.get_by_role("button", name="Add Lot")
        submit_button.click()

        # 6. Assert that the new item is in the table
        print("Verifying new item in table...")
        new_row = page.get_by_role("row", name="COVID-19 - Pfizer Pfizer-BioNTech PFIZER-DEMO-007 75 7/31/2027 Log 1 Dose Used")
        expect(new_row).to_be_visible()
        print("New item successfully added to the table.")

        # 7. Take the final screenshot
        final_screenshot_path = "jules-scratch/verification/verification.png"
        page.screenshot(path=final_screenshot_path)
        print(f"Final screenshot saved to {final_screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run_verification()
