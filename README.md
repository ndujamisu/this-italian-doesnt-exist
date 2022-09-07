# this-italian-doesnt-exist
Random fake Italian identity generator. But mostly just a web scraping exercise.

Each scraper implements parallel processing through worker threads.

### Expected output
{'name': *\<name\>*, 'surname': *\<surname\>*, 'postcode': *\<postcode\>*, 'city': *\<city\>*, 'dob': *\<dob\>*, 'email': *\<email\>*, 'phone': *\<phone\>*, }

### Required dependencies:
cheerio, node-fetch

## Project structure:<br />
**└── data**: folder that stores scraping results<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── cognomi.json**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── comuni.json**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── nomi.json**<br />
**├── scraping**: each data category will have a main thread and worker associated<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── node_modules**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── fetch.js**: Fetch API's implementation for NodeJS<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── main-cognomi.js**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── main-comuni.js**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── main-nomi.js**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── package-lock.json**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── package.json**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── progress-bar.js**: custom progress bar implementation<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── worker-cognomi.js**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── worker-comuni.js**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── worker-nomi.js**<br />
**│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── worker-pool.js**: custom worker pool implementation<br />
**├── LICENSE.md**<br />
**├── README.md**<br />
**└── generate.py**: application's entry point
