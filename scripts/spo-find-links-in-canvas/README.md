

# Find Links in Modern Page

## Summary

Script will take a csv file that contains url to SharePoint sites and analyse the site pages to see if any of the pages have hyperlinks.
For every hyperlink in a page this gets output to a row in a csv that is delimited by a pipe

The script reads a list of SharePoint sites from a CSV file, connects to each site and extracts all pages within the specified lists. For every page content that contains an anchor tag, it captures both 'Title' field value (from Page metadata) along with any href tags present in its body text using regex matching, then writes these details into a new CSV file named after today’s date.

Note: Above last paragraph of description uses AI to describe the script.

# [PnP PowerShell](#tab/pnpps)

```powershell

 # Each site in this list will have the script run against
$csv_SiteList = "sites-test.csv"
$csv_siteheaders = 'Url'

# Date used in the file creation
$date = Get-Date
$date = $date.ToString("yyyymmddhhss")

# filename by using the date
$file_name = $date + 'LinkMatches.csv'

# Path to create the output fil
$creation_path = Get-Location

# The site pages list that this script will run against
$List = "SitePages"

# Headers for the output csv
$headers = "Site Title|Page Title|Page Url|Href Tag"

# new line character
$ofs = "`n"

# delimiter to use
$delim = '|'

# regex used to match the href tags that are embeded in the canvas page content
$regex ='<a\s+(?:[^>]*?\s+)?href=(["])(.*?)\1>'

# create object of all the sites
$sites = Import-Csv -Path $csv_SiteList -Header $csv_siteheaders

#variable for the header
$csv_outputheader = $headers + $ofs

#complete file path
$csv_path = Join-Path $creation_path $file_name

# create output csv
New-Item -Path $creation_path -Name $file_name -ItemType File -Value $csv_outputheader

# itterate around each site from the csv
foreach($site in $sites)
{
    # make the connection, get ome site information and create object that contains all the site pages
    $connection = Connect-PnPOnline -Url $site.Url -Interactive
    $pnpsite = Get-PnPWeb -Connection $connection
    $site_title = $pnpsite.Title
    $pages = (Get-PnPListItem -List $List -Fields "CanvasContent1", "Title" -Connection $connection).FieldValues

    # itterate around each page in the stie to get the information from each page that will be used to build up the row and also conduct
    # the check to see if the canvas content has any href tags embeded
    foreach($page in $pages)
    {
        $page_title = $page.Get_Item("Title")
        $fileref = $page.Get_Item("FileRef")
        $canvascontent = $page.Get_Item("CanvasContent1")
        # check if the canvas has content 
        if ($canvascontent.Length -gt 0) 
        {
            # hash table of the results that match the href regular expression
            $hrefmatches = ($canvascontent | select-string -pattern $regex -AllMatches).Matches.Value

            # itterate around each regular expression match and write it out into the output csv that is pipe delimited 
            foreach($hrefmatch in $hrefmatches)
            {
                $row = $site_title + $delim + $page_title + $delim + $fileref + $delim + $hrefmatch
                Add-Content -Path $csv_path -Value $row
            }
        }
    }
    Disconnect-PnPOnline
}

```
[!INCLUDE [More about PnP PowerShell](../../docfx/includes/MORE-PNPPS.md)]
***

## Source

This script was first created on PnP PowerShell and transferred over in Dec 2024. Details of the orignal author missing. Report if inaccurate.
https://github.com/pnp/powershell

## Contributors

| Author(s) |
|-----------|
| Paul Bullock |

[!INCLUDE [DISCLAIMER](../../docfx/includes/DISCLAIMER.md)]
<img src="https://m365-visitor-stats.azurewebsites.net/script-samples/scripts/spo-find-links-in-canvas" aria-hidden="true" />
