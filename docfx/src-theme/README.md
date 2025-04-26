# Introduction

For the new DocFx theme for PnP Script Samples, we are using the build framework that DocFx to compile the modern theme.
This will be altered to suit the requirements of PnP Script Samples including:

- Cards for selecting samples
- Layout customisations to improve visual layout
- Use as much as the DocFx Modern theme as possible, e.g. Clipboard JS features are no longer needed as built in
- Dark mode option

- Theme the colours according to PnP Script Samples, but ensure its in reusable format
- Integration of Isotope into the card presentation system
- Filtering of samples, should as per existing functionality
- Needs to work on Mobile, Tablet, PC/MAC

# Build the theme

Run

```powershell
node build.js
```

This will copy the theme files to templates/modern-script-samples.
This theme framework is part of a two stage upgrade to incorporate Stefen's DocFx theme.
