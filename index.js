#!/usr/bin/env node

const puppeteer = require("puppeteer");

const usage = `
Usage: grades [USER] [PASS]
Command line tool to scrape your grades from myconcordia`;

if (process.argv.length < 4) {
    console.error(usage.trim());
    process.exit(1);
}

const [user, pass] = process.argv.slice(2);

const main = async () => {
    const browser = await puppeteer.launch({
        // website times out when running headless
        headless: false,
    });
    const page = await browser.newPage();

    // navigate to mobile website because it shows all grades at once
    await page.goto("https://m.myconcordia.ca/login.html", {
        waitUntil: "networkidle0"
    });

    await page.type("#userid", user);
    await page.type("#pwd", pass);
    await page.click(".login-form input.form_button_submit");
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // detect if the login page has reloaded with an error message
    if (await page.$("#login_error") !== null) {
        await browser.close();
        throw new Error("invalid credentials");
    }

    await page.click("#btnGrade");
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    await page.click("#btnAllGrades");

    // read data from page
    const data = await page.evaluate(() => {
        const courses = [];

        let semester = "";
        document.querySelector("#student-schedule").childNodes.forEach(node => {
        if (node.nodeName === "H3") {
            semester = node.textContent;
        }
        if (node.classList.contains("course")) {
            courses.push({
                semester,
                title: node.childNodes[0].textContent,
                grade: node.lastChild.textContent
            });
        }
        });

        return courses;
    });

    // print data
    data.forEach((c) => {
        const semester = c.semester.split(" ").reverse().join(" ");
        const title = c.title.trim().split(" ").slice(0, 2).join("").padEnd(8);

        let grade = c.grade.trim();
        if (!grade.match(/[ABCDEF][+-]?|PASS|FAIL/g)) grade = "--";
        grade = grade.padEnd(4);

        console.log(`${title} ${grade} ${semester}`);
    });

    await browser.close();
};

main().catch(err => {
    console.error(err.toString());
    process.exit(2);
});
