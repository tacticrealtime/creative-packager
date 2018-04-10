# Description

Tiny utility for packaging creatives into .zip files before uploading to Tactic.

# Usage

Run `creative-packager -n <name of creative>` inside directory of creative.

Parameters description:

Parameter | Value | Description | Optional or mandatory
--- | --- | --- | ---
-n, --creative-name <name of creative> | Any string | Name of creative | Mandatory
-v, --creative-version [value] | Any string | Version of creative | Optional
-d, --add-date | N/A | Add current date to .zip name | Optional

Specify target zip file name as parameter. You can also add current date or version in arbitrary format.
For example `creative-packager -n image-text-primitive -d` will make archive `image-text-primitive-YYYY-MM-DD.zip` (with current date in place of YYYY-MM-DD). 

# Installation

This utility should be installed as dev dependency of creative.
Just run `npm install --save-dev github:tacticrealtime/creative-packager` inside directory of creative.
Then the following script can be added to package.json:
`"zip": "./node_modules/creative-packager/index.js -n $npm_package_name -d"`
After that you can package your creative by running `node run zip` command.