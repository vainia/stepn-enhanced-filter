# Enhanced Filter for StepN Marketplace

## Description

Filter for StepN marketplace but convenient ⚡️

## Usage

1. Open Chrome browser and navigate to Chrome Web Store. There you can find the extension [Enhanced Filter for STEPN](https://chrome.google.com/webstore/detail/enhanced-filter-for-stepn/amibnhkklghdncklemlohpglbbbnpjhe)
2. Once extension is installed make sure you're on Marketplace of STEPN page and logged in
3. To activate extension find it (green icon with a black thunder in the middle) in the extensions menu in the browser and click it. Pop-up dialog will show up. Here the fun begins.

If you have any suggessions to this project, don't hesitate to write me. [Find me on LinkTree.](https://linktr.ee/inapolsky)

## Features

- ### Attributes filter
  - By separate set of attributes
  - By minimum base points
  - By minimum assigned points
  - By exclusively base points where additional points are unassigned
- ### Gem sockets filter
  - By separate set of sockets
  - By gem socket type and level
  - Following the order of the defined sockets

## Peculiarities

- ### Works together with native filters of the Marketplace of STEPN

  - Select desired filters on Marketplace of STEPN and on top of these Enhanced Filters will get applied.

    <b><u>NOTE: Make sure to open extension pop-up to initiate scripts before selecting the native filters!</u></b>

- ### Highly adjustable
  - Define sneakers search limit to allow filter giving you more results (might take longer for filter to find them)
  - Define custom timeout between requests to STEPN servers (low timeout values are not recommended)
  - Define request parameters for script to know which native filter parameters to be included into the enhanced filter calls to STEPN API
  - Define query selector of the native STEPN sort dropdown and option buttons which script will press to display the filter results

# FAQs

Are there any other devs/users who checked the code? How can we trust the script and be sure it is not stealing our assets?

> The source code of this project is publicly available on GitHub and can be read by anyone. If there was any malicious commands in the code, another programmer would be able to call it out. Since it’s public there is nothing to hide.

Does this tool work on mobile devices or only desktop?

> Currently this tool is only available on desktop browsers where you can access the console

Is this an official STEPN tool? Is it based on STEPN codebase?

> It is an unofficial/unsponsored project build from scratch and based on publicly available data from STEPN Marketplace site. STEPN team is well aware of this project (at least Gilgamesh knows about it). This project has also received heads up from one of STEPN's ambassadors.

When browser extension is ready?

> It is (currently for Chrome) out live since v2.0.0 😋

Can I submit my own feedback to this project?

> Of course, you are much welcome to leave me some comments, suggestions or requests either on GitHub by creating a new "Issue" or via [the form you can find here](https://linktr.ee/inapolsky).

What are the chances that STEPN will warn/ban an account, because Enhanced Filtering tool is stressing STEPN servers by sending too many requests?

> STEPN won’t ban accounts for requesting publicly available Marketplace data repeatedly – users might be scrolling too fast on Marketplace page and each page will keep calling API to load more sneakers and that shouldn’t give account a ban. Only a temporary IP restriction might be applied by Cloudflare services (as one of the mechanisms preventing DDOS attacks) where STEPN is hosting their APIs. That restriction should be mitigated/avoided with timeouts in the script of this project.

Can I use native STEPN filters with Enhanced Filters?

> Definitely! That is one of the key features of this project - as much close integration with the native STEPN Marketplace processes as possible. Enhanced Filter is compatible with native filters and will work on top of their results.

Why script doesn't work and nothing shows up on the page?

> Make sure that on STEPN Marketplace page the left section with all the native filters is visible when applying the script. If browsers window isn’t wide enough that section might be hidden and thus script is unable to render its UI.

# Credits

Support the project `2stFvNdELDQ56C6vD71Lt3jKN9Th4r7cfkpJchwyxJ6x` (solana wallet)

[#StandWithUkraine](https://u24.gov.ua/donate/renew)
