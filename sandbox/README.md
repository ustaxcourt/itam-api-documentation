# Welcome to our API Documentation Sandbox!
This folder is intended to be a bit more of a dev segment for this repo. Where we can experiment and document on the application of various methods and tools used to achieve our API goals.


`testXRM.js`: This file is produced from the XRMToolBox. [Documentation located here](https://www.xrmtoolbox.com/documentation/). The toolbox has a tool called __Dataverse REST Builder__ that can facilitate requests to dataverse tables. This script can be run from the Dynamics 365 page of the "USTC - Dev" environment within the USTC M365 set-up. It renders location data from our fac_asset_ref_location table as such: (I may record this as a separate result file - may record all results files as separate files.. TBD)
<details>
  <summary>
    Results Snippet
  </summary>
  
  ```0
: 
{@odata.etag: 'W/"9862106"', crf7f_office_name: 'Admissions', crf7f_fac_asset_ref_locationid: '4450fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
1
: 
{@odata.etag: 'W/"9862107"', crf7f_office_name: 'Deputy Clerk', crf7f_fac_asset_ref_locationid: '4550fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
2
: 
{@odata.etag: 'W/"9862108"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '4650fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
3
: 
{@odata.etag: 'W/"9862111"', crf7f_office_name: 'Reporters', crf7f_fac_asset_ref_locationid: '4750fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
4
: 
{@odata.etag: 'W/"9862123"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '4c50fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
5
: 
{@odata.etag: 'W/"9862128"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '4d50fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
6
: 
{@odata.etag: 'W/"9862133"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '4e50fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
7
: 
{@odata.etag: 'W/"9862134"', crf7f_office_name: '(OHR) Office Human Resources', crf7f_fac_asset_ref_locationid: '4f50fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
8
: 
{@odata.etag: 'W/"9862139"', crf7f_office_name: 'Case Services Division', crf7f_fac_asset_ref_locationid: '5450fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
9
: 
{@odata.etag: 'W/"9862140"', crf7f_office_name: 'Chambers of the Chief Judge', crf7f_fac_asset_ref_locationid: '5550fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
10
: 
{@odata.etag: 'W/"9862145"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '5650fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
11
: 
{@odata.etag: 'W/"9862148"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '5750fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
12
: 
{@odata.etag: 'W/"9862159"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '5c50fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
13
: 
{@odata.etag: 'W/"9862158"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '5d50fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
14
: 
{@odata.etag: 'W/"9862162"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '5e50fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
15
: 
{@odata.etag: 'W/"9862163"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '5f50fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
16
: 
{@odata.etag: 'W/"9862195"', crf7f_office_name: 'Trial Clerks', crf7f_fac_asset_ref_locationid: '6650fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
17
: 
{@odata.etag: 'W/"9862194"', crf7f_office_name: 'UNKNOWN OFFICE NAME', crf7f_fac_asset_ref_locationid: '6750fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'UNKNOWN LOCATION TYPE', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
18
: 
{@odata.etag: 'W/"9862197"', crf7f_office_name: 'Depot', crf7f_fac_asset_ref_locationid: '6850fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Depot', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
19
: 
{@odata.etag: 'W/"9862196"', crf7f_office_name: 'Records Intake Section', crf7f_fac_asset_ref_locationid: '6950fb6a-2979-f011-b4cc-000d3a5b5036', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
20
: 
{@odata.etag: 'W/"9862098"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '6da13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
21
: 
{@odata.etag: 'W/"9862099"', crf7f_office_name: 'Office of the Clerk', crf7f_fac_asset_ref_locationid: '6ea13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
22
: 
{@odata.etag: 'W/"9862100"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '6fa13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
23
: 
{@odata.etag: 'W/"9862101"', crf7f_office_name: 'Docket Section', crf7f_fac_asset_ref_locationid: '70a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Docket Section', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
24
: 
{@odata.etag: 'W/"9862124"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '75a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
25
: 
{@odata.etag: 'W/"9862125"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '76a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
26
: 
{@odata.etag: 'W/"9862122"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '77a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
27
: 
{@odata.etag: 'W/"9862126"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '78a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
28
: 
{@odata.etag: 'W/"9862138"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '7da13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
29
: 
{@odata.etag: 'W/"9862142"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '7ea13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: null, statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
30
: 
{@odata.etag: 'W/"9862146"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '7fa13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Chambers', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
31
: 
{@odata.etag: 'W/"9862205"', crf7f_office_name: 'Office of Financial Management', crf7f_fac_asset_ref_locationid: '83a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
32
: 
{@odata.etag: 'W/"9862200"', crf7f_office_name: 'Information Services', crf7f_fac_asset_ref_locationid: '84a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
33
: 
{@odata.etag: 'W/"9862201"', crf7f_office_name: '(OIS) Office Information Systems', crf7f_fac_asset_ref_locationid: '85a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
34
: 
{@odata.etag: 'W/"9862204"', crf7f_office_name: 'Facilities', crf7f_fac_asset_ref_locationid: '86a13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
35
: 
{@odata.etag: 'W/"9862215"', crf7f_office_name: 'Tax Court Security', crf7f_fac_asset_ref_locationid: '8ba13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
36
: 
{@odata.etag: 'W/"9862214"', crf7f_office_name: 'Home (HO)', crf7f_fac_asset_ref_locationid: '8ca13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
37
: 
{@odata.etag: 'W/"9862216"', crf7f_office_name: 'US Marshalls Office', crf7f_fac_asset_ref_locationid: '8da13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
38
: 
{@odata.etag: 'W/"9862220"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '8ea13a68-2979-f011-b4cc-00224804c8e9', crf7f_location_type: 'Field Courthouse', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
39
: 
{@odata.etag: 'W/"9862115"', crf7f_office_name: null, crf7f_fac_asset_ref_locationid: '338ede6c-2979-f011-b4cc-6045bd052080', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
40
: 
{@odata.etag: 'W/"9862114"', crf7f_office_name: 'Petitions & Calendar Section', crf7f_fac_asset_ref_locationid: '348ede6c-2979-f011-b4cc-6045bd052080', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
41
: 
{@odata.etag: 'W/"9862117"', crf7f_office_name: 'Deputy & Assistant General Counsel', crf7f_fac_asset_ref_locationid: '358ede6c-2979-f011-b4cc-6045bd052080', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
42
: 
{@odata.etag: 'W/"9862120"', crf7f_office_name: 'ADC Office', crf7f_fac_asset_ref_locationid: '388ede6c-2979-f011-b4cc-6045bd052080', crf7f_location_type: 'Office', statecode@OData.Community.Display.V1.FormattedValue: 'Active', …}
43
: 
{@odata.etag: 'W/"9862153"', c```
</details>
