#CryoWeb

*Created, I believe, from Yeoman stencil (Don't quite remember!)*

Remote monitoring system for JCU's cryogenic electrical characterisation test facility. Designed, but not limited, to run on the Heroku platform.

Run from `./bin/www` (see Procfile for Heroku launch task)

Main process is `app.js`.

Pages are fetched from the appropriate JS in `./routes/`, and are (generally) in turn rendered from Jade files in `./views/`.

Scripts to be run on page, e.g. for displaying the appropriate plots, are located under `./public/javascripts/`, and may be embedded in rendered Jade files.

Easiest way to test is using the Heroku foreman app. Simply navigate in command line to the root folder (CryoWeb) and type:

`$ foreman start`

Foreman will launch based on the Procfile as it would launch on the Heroku website.