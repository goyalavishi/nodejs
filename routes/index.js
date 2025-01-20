const express = require("express");
const axios = require("axios");

const app = express();

// Configuration for Naukri API
let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.naukri.com/jobapi/v3/search?noOfResults=20&urlType=search_by_location&searchType=adv&location=india&pageNo=1&jobAge=1&jobPostType=1&seoKey=jobs-in-india&src=jobsearchDesk&latLong=",
  headers: {
    appid: "109",
    systemid: "Naukri",
    Authorization: "Bearer eyJraWQiOiIyIiwidHlwIjoiSldUIiwiYWxnIjoiUlM1MTIifQ.eyJ1ZF9yZXNJZCI6Mjg5MjM4MjA4LCJzdWIiOiIzMDAyOTc3NTYiLCJ1ZF91c2VybmFtZSI6Im5hbWFuQHdlZWtkYXkudGVhbSIsInVkX2lzRW1haWwiOnRydWUsImlzcyI6IkluZm9FZGdlIEluZGlhIFB2dC4gTHRkLiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzIuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImlwQWRyZXNzIjoiMjQwNToyMDE6ODAxZDo2MDY5OjFkODM6OTgxZTpmNmM5OmRlOTIiLCJ1ZF9pc1RlY2hPcHNMb2dpbiI6ZmFsc2UsInVzZXJJZCI6MzAwMjk3NzU2LCJzdWJVc2VyVHlwZSI6IiIsInVzZXJTdGF0ZSI6IkFVVEhFTlRJQ0FURUQiLCJ1ZF9pc1BhaWRDbGllbnQiOmZhbHNlLCJ1ZF9lbWFpbFZlcmlmaWVkIjp0cnVlLCJ1c2VyVHlwZSI6ImpvYnNlZWtlciIsInNlc3Npb25TdGF0VGltZSI6IjIwMjUtMDEtMThUMjE6NTQ6NDAiLCJ1ZF9lbWFpbCI6Im5hbWFuQHdlZWtkYXkudGVhbSIsInVzZXJSb2xlIjoidXNlciIsImV4cCI6MTczNzMxMTAyMywidG9rZW5UeXBlIjoiYWNjZXNzVG9rZW4iLCJpYXQiOjE3MzczMDc0MjMsImp0aSI6ImJjMjA5MDI3YWZlNTQ1NmY4YjhhODRkYzdkMDEyNWE4IiwicG9kSWQiOiJwcm9kLWNkNWY5OTU2ZC00Z2twciJ9.EN0zvlT9xx8PS5Uf9JGIzQIWC_N-mdUjCzl_CEyRNBZ0IxtL82TXbQqaGs0dvk4yY5dkvLEQs_gYteiZWf-HCULVsrkUIPjgvyhlUPVsU4ymJbapYVDL6JdHoM_adqzgNVXc-NkG2MHnkHEnE8hEKrRhananmH4oJkfnvmYlDFA0TlVJvp3sWCb_jpzDpwWekSlzrQBfSRF00XWaRxxjXhmq5KnKsiRfaWiBgBlUTsz55rYf3EaIsOBD3OPIKStfR6dDrd0UEbFuahABudzaE4aTtaEp_d28izBFRCtuLDIsq4em2RNfpP8CEf6B8e_RxnpVPkH7UTsTVcdN1aP6Ng", // Replace with your token
    Cookie: "J=0; _t_ds=11a855181737296690-511a85518-011a85518",
    "user-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  },
};

// Function to fetch all pages of job data
async function fetchAllPages() {
  try {
    // Fetch the first page to get total job count
    let response = await axios.request(config);
    console.log("Data fetched from page 1");

    const totalJobs = response.data.noOfJobs;
    const jobsPerPage = 20;
    const totalPages = Math.ceil(totalJobs / jobsPerPage);

    let allJobs = [...response.data.jobDetails]; // Store jobs
    console.log(`Total jobs: ${totalJobs}, Pages to fetch: ${totalPages}`);

    // Loop through remaining pages
    for (let page = 2; page <= totalPages; page++) {
      config.url = `https://www.naukri.com/jobapi/v3/search?noOfResults=20&urlType=search_by_location&searchType=adv&location=india&pageNo=${page}&jobAge=1&jobPostType=1&seoKey=jobs-in-india&src=jobsearchDesk&latLong=`;

      let nextPageResponse = await axios.request(config);
      console.log(`Data fetched from page ${page}`);
      allJobs = [...allJobs, ...nextPageResponse.data.jobDetails];
    }

    return allJobs;
  } catch (error) {
    console.error("Error occurred during the fetch:", error);
    return { error: "Failed to fetch job details." };
  }
}

// API Endpoint to fetch jobs
app.get("/fetch-jobs", async (req, res) => {
  try {
    const jobs = await fetchAllPages();
    res.json(jobs);
  } catch (err) {
    res.status(500).send("Error fetching jobs");
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
